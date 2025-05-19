import { config } from 'dotenv';

config(); // Load environment variables

export const getMongoConfig = () => {
  const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DATABASE } = process.env;

  if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_HOST || !MONGODB_DATABASE) {
    throw new Error('Missing MongoDB environment variables');
  }

  // Encode special characters in username and password
  const encodedUsername = encodeURIComponent(MONGODB_USERNAME);
  const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

  return {
    uri: `mongodb+srv://${encodedUsername}:${encodedPassword}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`,
    autoIndex: true,
    autoCreate: true,
  };
};
