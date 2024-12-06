import { dbInit } from '../config/database';

describe('Database Tests', () => {
  let connection: any; // For clearing the database between tests

  before(async () => {
    // Establish a connection
    connection = await dbInit();
  });

  after(async () => {
    // Close the connection (important!)
    await connection.close();
  });

});
