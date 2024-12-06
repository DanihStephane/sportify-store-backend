import { eq, sql, SQL } from "drizzle-orm";
import { dbInit } from "../../config/database";
import paginate, { PaginationOptions } from "../helpers/pagination.helper";

export class CrudService {
  private database: any;
  private model: any;

  /**
   * The constructor of the CrudService class
   */
  constructor(model: any) {
    /**
     * The database connection
     */
    this.model = model;
    this.database = null; // Initialize database as null
  }

  /**
   * Initialize the database connection asynchronously if not already initialized.
   */
  private async initDB() {
    try {
      if (!this.database) {
        this.database = await dbInit();
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  /**
   * Ensure that the database connection is initialized.
   */
  private async ensureDBInitialized() {
    if (!this.database) {
      await this.initDB();
    }
  }

  /**
   * Get the current database connection.
   * @returns The existing database connection.
   */
  public async db() {
    const db = await dbInit();

    if (!db) throw new Error("Database connection is not initialized.");
    return db;
  }

  /**
   * Create a new entry in the specified table.
   * @param data The entity object or array to insert
   * @param id Whether the id is specified or not
   * @returns The result of the insert query
   */
  async create<T>(data: T | T[] = []): Promise<T | T[]> {
    await this.ensureDBInitialized();
    
    try {    
      const result = await this.database.insert(this.model).values(data).$returningId();
  
      return result as T | T[]; // Return the inserted records
    } catch (error) {
        throw new Error(`Failed to create entry in ${this.model}: ${error.message}`);
    }
  }

  /**
   * Update an existing entry in the specified table.
   * @param id The primary key of the entry to update
   * @param data The data to update
   * @returns The result of the update query
   */
  async update<T>(id: string | number, data: T): Promise<T> {
    await this.ensureDBInitialized();

    try {
      const result = await this.database
        .update(this.model)
        .set(data)
        .where(eq(this.model.id, id));
      return result[0] as T;
    } catch (error) {
      throw new Error(`Failed to update entry in ${this.model}: ${error.message}`);
    }
  }

  /**
   * Delete an existing entry from the specified table by its filters.
   * @param filters The SQL filters to apply
   * @returns The result of the delete query
   */
  async delete<T>(filters: SQL): Promise<T> {
    if (!filters) {
      throw new Error("Filters are required.");
    }

    await this.ensureDBInitialized();

    try {
      const result = await this.database
        .delete(this.model)
        .where(filters)
        .returning();
      return result as T;
    } catch (error) {
      throw new Error(`Failed to delete entry from ${this.model}: ${error.message}`);
    }
  }

  /**
   * Find entries in the specified table that match the specified filter conditions.
   * @param filters The SQL filters to apply
   * @returns The result of the SELECT query
   */
  async find<T>(filters: SQL): Promise<T[]> {
    if (!filters) {
      throw new Error("Filters are required.");
    }

    await this.ensureDBInitialized();

    try {
      const result = await this.database
        .select()
        .from(this.model)
        .where(filters);
      return result as T[];
    } catch (error) {
      console.log(`Failed to find entries in ${this.model}: ${error.message}`);
      throw new Error(`Failed to find entries in ${this.model}: ${error.message}`);
    }
  }

  /**
   * Find an entry in the specified table by its primary key.
   * @param id The primary key of the entry to find
   * @returns The first entry found or undefined if no matching entry exists
   */
  async findById<T>(id: string | number): Promise<T> {
    await this.ensureDBInitialized();

    try {
      const result = await this.database
        .select()
        .from(this.model)
        .where(eq(this.model.id, id))
        .limit(1);
      return result[0] as T; // Return the first item or undefined
    } catch (error) {
      throw new Error(`Failed to find entry by id in ${this.model}: ${error.message}`);
    }
  }

  /**
   * Find all entries in the specified table.
   * @returns All entries found or an empty array if no matching entries exist
   */
  async findAll(options?: PaginationOptions, filters?: any): Promise<any> {
    await this.ensureDBInitialized();
    
    return await  paginate(
      // Fetch paginated data
      async (offset, limit) => {
        const query = this.database
          .select()
          .from(this.model)
          .offset(offset)
          .limit(limit);
        
        if(filters){
          query.where(filters);
        }
        
        return await query;
      },
      
      // Fetch total count
      async () => {
        const countQuery = this.database
          .select({ count: sql<number>`count(*)` })
          .from(this.model);
        
        if(filters){
          countQuery.where(filters);
        }
        
        const result = await countQuery;
        
        return parseInt(result[0]?.count || "0", 10);
      },
      options
    );
  }
}