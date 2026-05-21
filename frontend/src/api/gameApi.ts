import type { ApiError, CreateGameRequest, GameResponse } from '../types';
import { localCreate, localDelete, localGet, localMove } from './local-generator';

const BASE_URL = '/api/games';

export const USE_LOCAL =
  (import.meta.env.VITE_USE_LOCAL as string | undefined) === '1';

async function handleResponse(response: Response): Promise<GameResponse> {
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(error?.message ?? `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<GameResponse>;
}

export async function createGame(request: CreateGameRequest): Promise<GameResponse> {
  if (USE_LOCAL) return Promise.resolve(localCreate(request));
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return handleResponse(response);
}

export async function getGame(gameId: string): Promise<GameResponse> {
  if (USE_LOCAL) return Promise.resolve(localGet(gameId));
  const response = await fetch(`${BASE_URL}/${gameId}`);
  return handleResponse(response);
}

export async function makeMove(gameId: string, cellIndex: number): Promise<GameResponse> {
  if (USE_LOCAL) return Promise.resolve(localMove(gameId, cellIndex));
  const response = await fetch(`${BASE_URL}/${gameId}/moves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cellIndex }),
  });
  return handleResponse(response);
}

export async function deleteGame(gameId: string): Promise<void> {
  if (USE_LOCAL) {
    localDelete(gameId);
    return;
  }
  await fetch(`${BASE_URL}/${gameId}`, { method: 'DELETE' });
}
