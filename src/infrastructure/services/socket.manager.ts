
const connectedUsers = new Map<string, string>(); 

export const addUser = (userId: string, socketId: string) => {
  connectedUsers.set(userId, socketId);
};

export const removeUser = (socketId: string) => {
  for (const [userId, sId] of connectedUsers.entries()) {
    if (sId === socketId) {
      connectedUsers.delete(userId);
      break;
    }
  }
};

export const getUserSocket = (userId: string): string | undefined => {
  return connectedUsers.get(userId);
};

export const getAllUsers = () => connectedUsers;
