import { EventEmitter } from "events";
import { AxiosHelper } from "./axiosHelper";
import { Player, ServerConfig } from "./types";

export class Server extends EventEmitter {
  private ip: string;
  private port: number;
  private logs: string[];
  private status: string;
  private players: Player[];
  private axiosHelper: AxiosHelper;

  constructor(config: ServerConfig) {
    super();
    if (!config.port) config.port = 30120;
    if (!config.ip) throw new Error("NO_ADDRESS");

    this.ip = config.ip;
    this.port = config.port;
    this.logs = [];
    this.status = "offline";
    this.players = [];
    this.axiosHelper = new AxiosHelper(`http://${this.ip}:${this.port}`);
    this.checkStatus();
    setInterval(() => this.checkStatus(), 5000);
  }

  private async checkStatus(): Promise<void> {
    try {
      await this.axiosHelper
        .get("info")
        .then(() => {
          this.status = "online";
          setTimeout(() => {
            this.fetchPlayers();
            this.factionStatus();
          }, 1000);
        })
        .catch(() => {
          this.status = "offline";
        });
      this.emit("statusUpdate", this.status);
    } catch (error) {
      console.error("Error checking server status:", error);
    }
  }

  private async factionStatus(): Promise<void> {
    try {
      await this.axiosHelper.get("info").then((data) => {
        if (!data) return;
        const { ambulance, mechanic, police, sheriff } = data.vars;
        this.emit("factionStatus", { ambulance, mechanic, police, sheriff });
      });
    } catch (error) {
      console.error("Error checking faction status:", error);
    }
  }

  private async fetchPlayers(): Promise<void> {
    try {
      const newPlayers = await this.axiosHelper.get("players");
      newPlayers.forEach((player: { id: string }) => {
        if (!this.players.find((p: { id: string }) => p.id === player.id)) {
          this.emit("joinPlayer", player);
        }
      });

      this.players.forEach((player: { id: string }) => {
        if (!newPlayers.find((p: { id: string }) => p.id === player.id)) {
          this.emit("leftPlayer", player);
        }
      });

      this.players = newPlayers;
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  }

  public async getStatus() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("info")
        .then(() => {
          resolve("online");
        })
        .catch(() => {
          resolve("offline");
        });
    });
  }

  public async getPlayers() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("players")
        .then((res) => {
          const players = [];
          for (const player of res) {
            players.push(player);
          }
          this.players = players;
          resolve(players);
        })
        .catch((err) => {
          reject({
            error: {
              message: err.message,
              stack: err.stack,
            },
            players: [],
          });
        });
    });
  }

  public async getServerData() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("info")
        .then((data) => {
          resolve(data.vars);
        })
        .catch((err) => {
          reject({
            error: {
              message: err.message,
              stack: err.stack,
            },
            data: {},
          });
        });
    });
  }

  public async getFactionData() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("info")
        .then((data) => {
          const { ambulance, mechanic, police, sheriff } = data.vars;
          resolve({ ambulance, mechanic, police, sheriff });
        })
        .catch((err) => {
          reject({
            error: {
              message: err.message,
              stack: err.stack,
            },
            FactionData: {},
          });
        });
    });
  }

  public async getMaxPlayers() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("info")
        .then((res) => {
          resolve(res.vars.sv_maxClients);
        })
        .catch((err) => {
          reject({
            error: {
              message: err.message,
              stack: err.stack,
            },
            maxPlayers: 0,
          });
        });
    });
  }

  public async getOnlinePlayers() {
    return new Promise((resolve, reject) => {
      this.axiosHelper
        .get("players")
        .then((res) => {
          resolve(res.length);
        })
        .catch((err) => {
          reject({
            error: {
              message: err.message,
              stack: err.stack,
            },
            playersOnline: 0,
          });
        });
    });
  }
}
