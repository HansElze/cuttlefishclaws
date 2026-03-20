import { users, subscriptions, type User, type InsertUser, type Subscription, type InsertSubscription } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptions(): Promise<Subscription[]>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSubscriptions(): Subscription[] {
  ensureDataDir();
  if (!fs.existsSync(SUBSCRIPTIONS_FILE)) return [];
  try {
    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf-8");
    return JSON.parse(data).map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveSubscriptions(subs: Subscription[]) {
  ensureDataDir();
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), "utf-8");
}

export class FileStorage implements IStorage {
  private users: Map<number, User>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const subs = loadSubscriptions();
    
    // Check for duplicate email
    const existing = subs.find(s => s.email.toLowerCase() === insertSubscription.email.toLowerCase());
    if (existing) {
      // Update interests if they resubscribe
      existing.interests = [...new Set([...existing.interests, ...insertSubscription.interests])];
      existing.name = insertSubscription.name;
      saveSubscriptions(subs);
      return existing;
    }

    const id = subs.length > 0 ? Math.max(...subs.map(s => s.id)) + 1 : 1;
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      createdAt: new Date(),
    };
    subs.push(subscription);
    saveSubscriptions(subs);
    return subscription;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    return loadSubscriptions();
  }
}

export const storage = new FileStorage();
