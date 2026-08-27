import { SaveUserRequest, SaveUserResponse } from "@/types/user";

const BASE_URL = "http://localhost:8080/api/user";

export async function saveUser(saveUserRequest: SaveUserRequest): Promise<SaveUserResponse> {
  const resposne = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(saveUserRequest),
  });

  if (!resposne.ok) {
    throw new Error("Failed to save user");
  }

  return resposne.json();
}
