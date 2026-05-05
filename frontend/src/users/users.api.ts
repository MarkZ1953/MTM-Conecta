import { ResourceAPI } from "@/api";

class UsersAPI extends ResourceAPI {
  constructor() {
    super({ resource: "users" });
  }
}

export const usersAPI = new UsersAPI();
