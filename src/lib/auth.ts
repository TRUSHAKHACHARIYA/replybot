export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  shopName: string;
  phone: string;
  niche: string;
  role: "owner" | "admin";
  plan: "starter" | "standard" | "growth";
}

const HARDCODED_USERS: User[] = [
  {
    id: "1",
    email: "admin@replybot.com",
    password: "admin123",
    name: "Admin User",
    shopName: "ReplyBot Admin",
    phone: "+91 99999 00000",
    niche: "admin",
    role: "admin",
    plan: "growth",
  },
  {
    id: "2",
    email: "priya@styleboutique.com",
    password: "shop123",
    name: "Priya Sharma",
    shopName: "Style Boutique",
    phone: "+91 98765 43210",
    niche: "boutique",
    role: "owner",
    plan: "standard",
  },
  {
    id: "3",
    email: "meera@glowsalon.com",
    password: "shop123",
    name: "Meera Joshi",
    shopName: "Glow Salon",
    phone: "+91 87654 32109",
    niche: "salon",
    role: "owner",
    plan: "growth",
  },
  {
    id: "4",
    email: "ankit@freshbakes.com",
    password: "shop123",
    name: "Ankit Patel",
    shopName: "Fresh Bakes",
    phone: "+91 76543 21098",
    niche: "bakery",
    role: "owner",
    plan: "starter",
  },
];

let registeredUsers: User[] = [...HARDCODED_USERS];

export function authenticateUser(email: string, password: string): User | null {
  const user = registeredUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}

export function registerUser(
  data: Omit<User, "id" | "role" | "plan">
): User | null {
  const exists = registeredUsers.find((u) => u.email === data.email);
  if (exists) return null;

  const newUser: User = {
    ...data,
    id: String(registeredUsers.length + 1),
    role: "owner",
    plan: "starter",
  };
  registeredUsers.push(newUser);
  return newUser;
}

export function getUserById(id: string): User | null {
  return registeredUsers.find((u) => u.id === id) || null;
}

export function getAllUsers(): User[] {
  return registeredUsers;
}
