import type { ApiError, CreateGameRequest, GameResponse } from '../types';

const BASE_URL = '/api/games';

async function handleResponse(response: Response): Promise<GameResponse> {
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(error?.message ?? `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<GameResponse>;
}

export async function createGame(request: CreateGameRequest): Promise<GameResponse> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return handleResponse(response);
}

export async function makeMove(gameId: string, cellIndex: number): Promise<GameResponse> {
  const response = await fetch(`${BASE_URL}/${gameId}/moves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cellIndex }),
  });
  return handleResponse(response);
}

export async function deleteGame(gameId: string): Promise<void> {
  await fetch(`${BASE_URL}/${gameId}`, { method: 'DELETE' });
}
