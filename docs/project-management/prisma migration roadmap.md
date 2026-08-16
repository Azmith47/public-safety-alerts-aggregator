 Step-by-Step Guide: Migrating to Prisma ORM                                                                                                           
                                                                                                                                                       
 Your Current Stack                                                                                                                                    
                                                                                                                                                       
 - Database: SQLite (better-sqlite3)                                                                                                                   
 - Query approach: Raw SQL through a BaseDAO pattern                                                                                                   
 - Schema: 18 tables (lookup tables, alerts, spatial data, subscriptions, etc.)                                                                        
 - Migrations: Manual ALTER TABLE scripts in migrate.js                                                                                                
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 1: Setup                                                                                                                                        
                                                                                                                                                       
 ### Step 1 — Install Prisma                                                                                                                           
                                                                                                                                                       
 ```bash                                                                                                                                               
   npm install prisma --save-dev                                                                                                                       
   npm install @prisma/client                                                                                                                          
 ```                                                                                                                                                   
                                                                                                                                                       
 ### Step 2 — Initialize Prisma                                                                                                                        
                                                                                                                                                       
 ```bash                                                                                                                                               
   npx prisma init                                                                                                                                     
 ```                                                                                                                                                   
                                                                                                                                                       
 This creates prisma/schema.prisma and a .env file.                                                                                                    
                                                                                                                                                       
 ### Step 3 — Configure the datasource                                                                                                                 
                                                                                                                                                       
 Edit prisma/schema.prisma:                                                                                                                            
                                                                                                                                                       
 ```prisma                                                                                                                                             
   generator client {                                                                                                                                  
     provider = "prisma-client-js"                                                                                                                     
   }                                                                                                                                                   
                                                                                                                                                       
   datasource db {                                                                                                                                     
     provider = "sqlite"                                                                                                                               
     url      = env("DATABASE_URL")                                                                                                                    
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 Edit your .env (add the SQLite path):                                                                                                                 
                                                                                                                                                       
 ```env                                                                                                                                                
   DATABASE_URL="file:./database/database.sqlite"                                                                                                      
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 2: Define the Schema                                                                                                                            
                                                                                                                                                       
 ### Step 4 — Create prisma/schema.prisma                                                                                                              
                                                                                                                                                       
 Based on your schema.sql, here's the complete Prisma schema:                                                                                          
                                                                                                                                                       
 ```prisma                                                                                                                                             
   // prisma/schema.prisma                                                                                                                             
                                                                                                                                                       
   generator client {                                                                                                                                  
     provider = "prisma-client-js"                                                                                                                     
   }                                                                                                                                                   
                                                                                                                                                       
   datasource db {                                                                                                                                     
     provider = "sqlite"                                                                                                                               
     url      = env("DATABASE_URL")                                                                                                                    
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Lookup Tables ───                                                                                                                            
                                                                                                                                                       
   model Category {                                                                                                                                    
     id    Int    @id @default(autoincrement())                                                                                                        
     name  String @unique                                                                                                                              
     alerts Alert[]                                                                                                                                    
     subscriptions Subscription[]                                                                                                                      
   }                                                                                                                                                   
                                                                                                                                                       
   model Source {                                                                                                                                      
     id          Int      @id @default(autoincrement())                                                                                                
     name        String   @unique                                                                                                                      
     websiteUrl  String?  @map("website_url")                                                                                                          
     alerts      Alert[]                                                                                                                               
     sourceHealth SourceHealth[]                                                                                                                       
   }                                                                                                                                                   
                                                                                                                                                       
   model Region {                                                                                                                                      
     id              Int        @id @default(autoincrement())                                                                                          
     name            String     @unique                                                                                                                
     councilAreas    CouncilArea[]                                                                                                                     
     subscriptions   Subscription[]                                                                                                                    
     alertsToRegions AlertsToRegion[]                                                                                                                  
   }                                                                                                                                                   
                                                                                                                                                       
   model StatusType {                                                                                                                                  
     id     Int    @id @default(autoincrement())                                                                                                       
     name   String @unique                                                                                                                             
     alerts Alert[]                                                                                                                                    
   }                                                                                                                                                   
                                                                                                                                                       
   model SeverityLevel {                                                                                                                               
     id     Int    @id @default(autoincrement())                                                                                                       
     name   String @unique                                                                                                                             
     description String?                                                                                                                               
     alerts Alert[]                                                                                                                                    
     subscriptions Subscription[]                                                                                                                      
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Geographic Tables ───                                                                                                                        
                                                                                                                                                       
   model CouncilArea {                                                                                                                                 
     id        Int       @id @default(autoincrement())                                                                                                 
     name      String    @unique                                                                                                                       
     regionId  Int?      @map("region_id")                                                                                                             
     region    Region?   @relation(fields: [regionId], references: [id])                                                                               
     locations Location[]                                                                                                                              
   }                                                                                                                                                   
                                                                                                                                                       
   model Location {                                                                                                                                    
     id             Int         @id @default(autoincrement())                                                                                          
     name           String                                                                                                                             
     postcode       String?                                                                                                                            
     councilAreaId  Int?        @map("council_area_id")                                                                                                
     councilArea    CouncilArea? @relation(fields: [councilAreaId], references: [id])                                                                  
     alerts         Alert[]                                                                                                                            
                                                                                                                                                       
     @@unique([name, postcode])                                                                                                                        
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Users ───                                                                                                                                    
                                                                                                                                                       
   model User {                                                                                                                                        
     id               Int           @id @default(autoincrement())                                                                                      
     email            String        @unique                                                                                                            
     verified         Boolean       @default(false) @map("verified")                                                                                   
     verificationToken String?      @map("verification_token")                                                                                         
     verificationSentAt DateTime?   @map("verification_sent_at")                                                                                       
     unsubscribeToken  String?       @map("unsubscribe_token")                                                                                         
     createdAt        DateTime      @default(now()) @map("created_at")                                                                                 
     subscriptions    Subscription[]                                                                                                                   
     notifications    Notification[]                                                                                                                   
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alerts ───                                                                                                                                   
                                                                                                                                                       
   model Alert {                                                                                                                                       
     id              Int              @id @default(autoincrement())                                                                                    
     externalId      String           @map("external_id")                                                                                              
     title           String                                                                                                                            
     description     String?                                                                                                                           
     categoryId      Int?             @map("category_id")                                                                                              
     category        Category?        @relation(fields: [categoryId], references: [id])                                                                
     sourceId        Int              @map("source_id")                                                                                                
     source          Source           @relation(fields: [sourceId], references: [id])                                                                  
     locationId      Int?             @map("location_id")                                                                                              
     location        Location?        @relation(fields: [locationId], references: [id])                                                                
     statusTypeId    Int?             @map("status_type_id")                                                                                           
     statusType      StatusType?      @relation(fields: [statusTypeId], references: [id])                                                              
     severityLevelId Int?             @map("severity_level_id")                                                                                        
     severityLevel   SeverityLevel?   @relation(fields: [severityLevelId], references: [id])                                                           
     issuedAt        DateTime?        @map("issued_at")                                                                                                
     updatedAt       DateTime?        @map("updated_at")                                                                                               
     sourceUrl       String?          @map("source_url")                                                                                               
     planned         Boolean          @default(false)                                                                                                  
     isMajor         Boolean          @default(false) @map("is_major")                                                                                 
     impactingNetwork Boolean         @default(false) @map("impacting_network")                                                                        
     delay           Int              @default(0)                                                                                                      
     startDate       DateTime?        @map("start_date")                                                                                               
     endDate         DateTime?        @map("end_date")                                                                                                 
     isActive        Boolean          @default(true) @map("is_active")                                                                                 
     rawPayload      String?          @map("raw_payload")                                                                                              
                                                                                                                                                       
     alertMarkers    AlertMarker[]                                                                                                                     
     alertPolygons   AlertPolygon[]                                                                                                                    
     alertPolylines  AlertPolyline[]                                                                                                                   
     alertRoads      AlertRoad[]                                                                                                                       
     alertAdvice     AlertAdvice[]                                                                                                                     
     alertFireDetail AlertFireDetail?                                                                                                                  
     alertsToRegions AlertsToRegion[]                                                                                                                  
     notifications   Notification[]                                                                                                                    
                                                                                                                                                       
     @@unique([externalId, sourceId])                                                                                                                  
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Subscriptions ───                                                                                                                            
                                                                                                                                                       
   model Subscription {                                                                                                                                
     id              Int             @id @default(autoincrement())                                                                                     
     userId          Int             @map("user_id")                                                                                                   
     user            User            @relation(fields: [userId], references: [id])                                                                     
     categoryId      Int?            @map("category_id")                                                                                               
     category        Category?       @relation(fields: [categoryId], references: [id])                                                                 
     regionId        Int?            @map("region_id")                                                                                                 
     region          Region?         @relation(fields: [regionId], references: [id])                                                                   
     councilAreaId   Int?            @map("council_area_id")                                                                                           
     councilArea     CouncilArea?    @relation(fields: [councilAreaId], references: [id])                                                              
     severityLevelId Int?            @map("severity_level_id")                                                                                         
     severityLevel   SeverityLevel?  @relation(fields: [severityLevelId], references: [id])                                                            
     isEnabled       Boolean         @default(false) @map("is_enabled")                                                                                
     createdAt       DateTime        @default(now()) @map("created_at")                                                                                
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Notifications ───                                                                                                                            
                                                                                                                                                       
   model Notification {                                                                                                                                
     id       Int    @id @default(autoincrement())                                                                                                     
     userId   Int    @map("user_id")                                                                                                                   
     user     User   @relation(fields: [userId], references: [id])                                                                                     
     alertId  Int    @map("alert_id")                                                                                                                  
     alert    Alert  @relation(fields: [alertId], references: [id])                                                                                    
     sentStatus String? @map("sent_status")                                                                                                            
     createdAt DateTime @default(now()) @map("created_at")                                                                                             
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert-Region Mapping ───                                                                                                                     
                                                                                                                                                       
   model AlertsToRegion {                                                                                                                              
     alertId  Int  @map("alert_id")                                                                                                                    
     regionId Int  @map("region_id")                                                                                                                   
     alert    Alert @relation(fields: [alertId], references: [id])                                                                                     
     region   Region @relation(fields: [regionId], references: [id])                                                                                   
                                                                                                                                                       
     @@id([alertId, regionId])                                                                                                                         
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Roads ───                                                                                                                              
                                                                                                                                                       
   model AlertRoad {                                                                                                                                   
     id               Int    @id @default(autoincrement())                                                                                             
     alertId          Int    @map("alert_id")                                                                                                          
     alert            Alert  @relation(fields: [alertId], references: [id])                                                                            
     mainStreet       String? @map("main_street")                                                                                                      
     crossStreet      String? @map("cross_street")                                                                                                     
     secondLocation   String? @map("second_location")                                                                                                  
     suburb           String?                                                                                                                          
     region           String?                                                                                                                          
     locationQualifier String? @map("location_qualifier")                                                                                              
     conditionTendency String? @map("condition_tendency")                                                                                              
     delay            String?                                                                                                                          
     queueLength      Float?  @map("queue_length")                                                                                                     
     trafficVolume    String? @map("traffic_volume")                                                                                                   
     impactedLanes    String? @map("impacted_lanes")                                                                                                   
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Links ───                                                                                                                              
                                                                                                                                                       
   model AlertLink {                                                                                                                                   
     id       Int    @id @default(autoincrement())                                                                                                     
     alertId  Int    @map("alert_id")                                                                                                                  
     alert    Alert  @relation(fields: [alertId], references: [id])                                                                                    
     linkText String  @map("link_text")                                                                                                                
     linkUrl  String? @map("link_url")                                                                                                                 
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Advice ───                                                                                                                             
                                                                                                                                                       
   model AlertAdvice {                                                                                                                                 
     id       Int    @id @default(autoincrement())                                                                                                     
     alertId  Int    @map("alert_id")                                                                                                                  
     alert    Alert  @relation(fields: [alertId], references: [id])                                                                                    
     message  String                                                                                                                                   
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Fire Details ───                                                                                                                       
                                                                                                                                                       
   model AlertFireDetail {                                                                                                                             
     id                 Int     @id @default(autoincrement())                                                                                          
     alertId            Int     @map("alert_id")                                                                                                       
     alert              Alert   @relation(fields: [alertId], references: [id])                                                                         
     fireType           String? @map("fire_type")                                                                                                      
     fireSize           Float?  @map("fire_size")                                                                                                      
     containmentStatus  String? @map("containment_status")                                                                                             
     responsibleAgency  String? @map("responsible_agency")                                                                                             
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Markers ───                                                                                                                            
                                                                                                                                                       
   model AlertMarker {                                                                                                                                 
     id        Int      @id @default(autoincrement())                                                                                                  
     alertId   Int      @map("alert_id")                                                                                                               
     alert     Alert    @relation(fields: [alertId], references: [id])                                                                                 
     latitude  Float                                                                                                                                   
     longitude Float                                                                                                                                   
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Polygons ───                                                                                                                           
                                                                                                                                                       
   model AlertPolygon {                                                                                                                                
     id            Int      @id @default(autoincrement())                                                                                              
     alertId       Int      @map("alert_id")                                                                                                           
     alert         Alert    @relation(fields: [alertId], references: [id])                                                                             
     polygonIndex  Int      @default(0) @map("polygon_index")                                                                                          
     ringIndex     Int      @default(0) @map("ring_index")                                                                                             
     pointOrder    Int?     @map("point_order")                                                                                                        
     latitude      Float                                                                                                                               
     longitude     Float                                                                                                                               
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Alert Polylines ───                                                                                                                          
                                                                                                                                                       
   model AlertPolyline {                                                                                                                               
     id            Int      @id @default(autoincrement())                                                                                              
     alertId       Int      @map("alert_id")                                                                                                           
     alert         Alert    @relation(fields: [alertId], references: [id])                                                                             
     lineIndex     Int      @default(0) @map("line_index")                                                                                             
     pointOrder    Int?     @map("point_order")                                                                                                        
     latitude      Float                                                                                                                               
     longitude     Float                                                                                                                               
   }                                                                                                                                                   
                                                                                                                                                       
   // ─── Source Health ───                                                                                                                            
                                                                                                                                                       
   model SourceHealth {                                                                                                                                
     id             Int      @id @default(autoincrement())                                                                                             
     sourceId       Int      @map("source_id")                                                                                                         
     source         Source   @relation(fields: [sourceId], references: [id])                                                                           
     lastRunAt      DateTime? @map("last_run_at")                                                                                                      
     lastSuccessAt  DateTime? @map("last_success_at")                                                                                                  
     lastFailureAt  DateTime? @map("last_failure_at")                                                                                                  
     lastStatus     String?  @map("last_status")                                                                                                       
     lastMessage    String?  @map("last_message")                                                                                                      
     runCount       Int      @default(0) @map("run_count")                                                                                             
     successCount   Int      @default(0) @map("success_count")                                                                                         
     failureCount   Int      @default(0) @map("failure_count")                                                                                         
     processedCount Int      @default(0) @map("processed_count")                                                                                       
     createdCount   Int      @default(0) @map("created_count")                                                                                         
     updatedCount   Int      @default(0) @map("updated_count")                                                                                         
     failedCount    Int      @default(0) @map("failed_count")                                                                                          
     createdAt      DateTime @default(now()) @map("created_at")                                                                                        
     updatedAt      DateTime @default(now()) @map("updated_at")                                                                                        
                                                                                                                                                       
     @@unique([sourceId])                                                                                                                              
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 3: Generate the Client & Migrate                                                                                                                
                                                                                                                                                       
 ### Step 5 — Generate the Prisma Client                                                                                                               
                                                                                                                                                       
 ```bash                                                                                                                                               
   npx prisma generate                                                                                                                                 
 ```                                                                                                                                                   
                                                                                                                                                       
 ### Step 6 — Create the initial migration                                                                                                             
                                                                                                                                                       
 ```bash                                                                                                                                               
   npx prisma migrate dev --name init                                                                                                                  
 ```                                                                                                                                                   
                                                                                                                                                       
 This will:                                                                                                                                            
 1. Generate a migration SQL file under prisma/migrations/                                                                                             
 2. Apply it to your SQLite database                                                                                                                   
 3. Generate the typed Prisma client                                                                                                                   
                                                                                                                                                       
 ### Step 7 — Verify the migration                                                                                                                     
                                                                                                                                                       
 ```bash                                                                                                                                               
   npx prisma db pull    # introspect current DB state                                                                                                 
   npx prisma db push    # sync schema (dev-only)                                                                                                      
   npx prisma studio     # open the GUI to inspect data                                                                                                
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 4: Replace DAOs with Prisma Client                                                                                                              
                                                                                                                                                       
 ### Step 8 — Create a Prisma service wrapper                                                                                                          
                                                                                                                                                       
 ```js                                                                                                                                                 
   // database/prismaService.js                                                                                                                        
   import { PrismaClient } from "@prisma/client";                                                                                                      
                                                                                                                                                       
   const globalForPrisma = globalThis;                                                                                                                 
                                                                                                                                                       
   export const prisma =                                                                                                                               
     globalForPrisma.prisma ??                                                                                                                         
     new PrismaClient({                                                                                                                                
       datasources: {                                                                                                                                  
         db: {                                                                                                                                         
           url: process.env.DATABASE_URL,                                                                                                              
         },                                                                                                                                            
       },                                                                                                                                              
     });                                                                                                                                               
                                                                                                                                                       
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;                                                                         
                                                                                                                                                       
   export default prisma;                                                                                                                              
 ```                                                                                                                                                   
                                                                                                                                                       
 ### Step 9 — Migrate DAOs one at a time (recommended order)                                                                                           
                                                                                                                                                       
 ┌──────────┬─────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────┐ 
 │ Priority │ DAO                                                                                             │ Why                                  │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 1        │ SourceDAO                                                                                       │ No dependencies — referenced by      │ 
 │          │                                                                                                 │ everything                           │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 2        │ CategoryDAO, SeverityLevelDAO, StatusTypeDAO, RegionDAO, CouncilAreaDAO, LocationDAO            │ Lookup tables, no foreign key        │ 
 │          │                                                                                                 │ dependencies                         │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 3        │ UserDAO, SubscriptionDAO, NotificationDAO                                                       │ Core user features                   │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 4        │ AlertDAO                                                                                        │ The central table                    │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 5        │ AlertRoadDAO, AlertLinkDAO, AlertAdviceDAO, AlertFireDetailDAO, AlertMarkersDAO,                │ Child/spatial tables                 │ 
 │          │ AlertPolygonDAO, AlertPolylineDAO                                                               │                                      │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 6        │ AlertRegionDAO                                                                                  │ Junction table                       │ 
 ├──────────┼─────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┤ 
 │ 7        │ SourceHealthDAO                                                                                 │ Monitoring                           │ 
 └──────────┴─────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────┘ 
                                                                                                                                                       
 Example: Replacing SourceDAO                                                                                                                          
                                                                                                                                                       
 Before:                                                                                                                                               
                                                                                                                                                       
 ```js                                                                                                                                                 
   // database/dao/SourceDAO.js                                                                                                                        
   class SourceDAO extends BaseDAO {                                                                                                                   
     constructor() { super("sources"); }                                                                                                               
                                                                                                                                                       
     async getOrCreate(name, websiteUrl = null) {                                                                                                      
       const row = await this.findOne(this.tableName, "name = ?", [name]);                                                                             
       if (row) return { id: row.id, created: false };                                                                                                 
       const result = await super.insert(this.tableName, { name, website_url: websiteUrl });                                                           
       return { id: result.id, created: true };                                                                                                        
     }                                                                                                                                                 
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 After:                                                                                                                                                
                                                                                                                                                       
 ```js                                                                                                                                                 
   // database/repositories/SourceRepository.js                                                                                                        
   import prisma from "../prismaService.js";                                                                                                           
                                                                                                                                                       
   class SourceRepository {                                                                                                                            
     async getOrCreate(name, websiteUrl = null) {                                                                                                      
       const existing = await prisma.source.findUnique({ where: { name } });                                                                           
       if (existing) return { id: existing.id, created: false };                                                                                       
                                                                                                                                                       
       const result = await prisma.source.create({                                                                                                     
         data: { name, websiteUrl },                                                                                                                   
       });                                                                                                                                             
       return { id: result.id, created: true };                                                                                                        
     }                                                                                                                                                 
   }                                                                                                                                                   
                                                                                                                                                       
   export default new SourceRepository();                                                                                                              
 ```                                                                                                                                                   
                                                                                                                                                       
 Example: Replacing AlertDAO                                                                                                                           
                                                                                                                                                       
 Before:                                                                                                                                               
                                                                                                                                                       
 ```js                                                                                                                                                 
   async create(alert) {                                                                                                                               
     return super.insert(this.tableName, {                                                                                                             
       external_id: alert.external_id,                                                                                                                 
       title: alert.title,                                                                                                                             
       // ... many fields                                                                                                                              
     });                                                                                                                                               
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 After:                                                                                                                                                
                                                                                                                                                       
 ```js                                                                                                                                                 
   async create(alert) {                                                                                                                               
     return prisma.alert.create({                                                                                                                      
       data: {                                                                                                                                         
         externalId: alert.external_id,                                                                                                                
         title: alert.title,                                                                                                                           
         description: alert.description,                                                                                                               
         categoryId: alert.category_id,                                                                                                                
         sourceId: alert.source_id,                                                                                                                    
         locationId: alert.location_id,                                                                                                                
         statusTypeId: alert.status_type_id,                                                                                                           
         severityLevelId: alert.severity_level_id,                                                                                                     
         issuedAt: alert.issued_at,                                                                                                                    
         updatedAt: alert.updated_at,                                                                                                                  
         sourceUrl: alert.source_url,                                                                                                                  
         planned: alert.planned,                                                                                                                       
         isMajor: alert.is_major,                                                                                                                      
         impactingNetwork: alert.impacting_network,                                                                                                    
         delay: alert.delay,                                                                                                                           
         startDate: alert.start_date,                                                                                                                  
         endDate: alert.end_date,                                                                                                                      
         isActive: alert.is_active,                                                                                                                    
         rawPayload: alert.raw_payload,                                                                                                                
       },                                                                                                                                              
     });                                                                                                                                               
   }                                                                                                                                                   
                                                                                                                                                       
   async getAllActiveAlerts() {                                                                                                                        
     return prisma.alert.findMany({                                                                                                                    
       where: {                                                                                                                                        
         endDate: null,                                                                                                                                
         OR: [{ endDate: { gt: new Date() } }],                                                                                                        
         isActive: true,                                                                                                                               
       },                                                                                                                                              
       orderBy: { issuedAt: "desc" },                                                                                                                  
       include: {                                                                                                                                      
         category: true,                                                                                                                               
         source: true,                                                                                                                                 
         location: true,                                                                                                                               
         statusType: true,                                                                                                                             
         severityLevel: true,                                                                                                                          
         alertMarkers: true,                                                                                                                           
         alertPolygons: true,                                                                                                                          
         alertPolylines: true,                                                                                                                         
         alertRoads: true,                                                                                                                             
         alertAdvice: true,                                                                                                                            
         alertFireDetail: true,                                                                                                                        
       },                                                                                                                                              
     });                                                                                                                                               
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 5: Update the Controllers & Services                                                                                                            
                                                                                                                                                       
 ### Step 10 — Update imports in controllers/services                                                                                                  
                                                                                                                                                       
 For each file that imports a DAO, change:                                                                                                             
                                                                                                                                                       
 ```diff                                                                                                                                               
   - import alertDAO from "../database/dao/AlertDAO.js";                                                                                               
   + import alertRepo from "../database/repositories/AlertRepository.js";                                                                              
 ```                                                                                                                                                   
                                                                                                                                                       
 Then update all method calls to use the new API.                                                                                                      
                                                                                                                                                       
 ### Step 11 — Handle the AlertDAO.update method                                                                                                       
                                                                                                                                                       
 Prisma doesn't have a direct update with dynamic fields. Use updateMany:                                                                              
                                                                                                                                                       
 ```js                                                                                                                                                 
   async update(id, alert) {                                                                                                                           
     const updateData = {};                                                                                                                            
     if (alert.title !== undefined) updateData.title = alert.title;                                                                                    
     if (alert.description !== undefined) updateData.description = alert.description;                                                                  
     // ... build dynamically                                                                                                                          
     return prisma.alert.updateMany({                                                                                                                  
       where: { id },                                                                                                                                  
       data: updateData,                                                                                                                               
     });                                                                                                                                               
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ### Step 12 — Handle the AlertDAO.exists method                                                                                                       
                                                                                                                                                       
 ```js                                                                                                                                                 
   async exists(externalId, sourceId = null) {                                                                                                         
     const where = { externalId };                                                                                                                     
     if (sourceId) where.sourceId = sourceId;                                                                                                          
     const row = await prisma.alert.findFirst({ where });                                                                                              
     return !!row;                                                                                                                                     
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 6: Migrate Seed & Init Scripts                                                                                                                  
                                                                                                                                                       
 ### Step 13 — Update seed.js                                                                                                                          
                                                                                                                                                       
 ```js                                                                                                                                                 
   // database/seed.js                                                                                                                                 
   import prisma from "./prismaService.js";                                                                                                            
   import { Categories, SeverityLevels, Statuses, Regions } from "../models/globalEnums.js";                                                           
                                                                                                                                                       
   export async function seed() {                                                                                                                      
     await prisma.$transaction(async (tx) => {                                                                                                         
       for (const category of Object.values(Categories)) {                                                                                             
         await tx.category.upsert({                                                                                                                    
           where: { name: category },                                                                                                                  
           update: {},                                                                                                                                 
           create: { name: category },                                                                                                                 
         });                                                                                                                                           
       }                                                                                                                                               
       for (const severity of Object.values(SeverityLevels)) {                                                                                         
         await tx.severityLevel.upsert({                                                                                                               
           where: { name: severity },                                                                                                                  
           update: {},                                                                                                                                 
           create: { name: severity, description: severity },                                                                                          
         });                                                                                                                                           
       }                                                                                                                                               
       for (const status of Object.values(Statuses)) {                                                                                                 
         await tx.statusType.upsert({                                                                                                                  
           where: { name: status },                                                                                                                    
           update: {},                                                                                                                                 
           create: { name: status },                                                                                                                   
         });                                                                                                                                           
       }                                                                                                                                               
       for (const region of Object.values(Regions)) {                                                                                                  
         await tx.region.upsert({                                                                                                                      
           where: { name: region },                                                                                                                    
           update: {},                                                                                                                                 
           create: { name: region },                                                                                                                   
         });                                                                                                                                           
       }                                                                                                                                               
     });                                                                                                                                               
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ### Step 14 — Remove the old init.js schema execution                                                                                                 
                                                                                                                                                       
 Prisma handles schema creation via migrate dev / migrate deploy. You can simplify init.js to:                                                         
                                                                                                                                                       
 ```js                                                                                                                                                 
   // database/init.js                                                                                                                                 
   import prisma from "./prismaService.js";                                                                                                            
   import { seed } from "./seed.js";                                                                                                                   
                                                                                                                                                       
   async function initializeDatabase() {                                                                                                               
     try {                                                                                                                                             
       await seed();                                                                                                                                   
       console.log("Database initialization completed successfully.");                                                                                 
     } catch (err) {                                                                                                                                   
       console.error("Error during database initialization:", err.message);                                                                            
       process.exit(1);                                                                                                                                
     } finally {                                                                                                                                       
       await prisma.$disconnect();                                                                                                                     
     }                                                                                                                                                 
   }                                                                                                                                                   
                                                                                                                                                       
   initializeDatabase();                                                                                                                               
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 7: Update Package Scripts                                                                                                                       
                                                                                                                                                       
 ### Step 15 — Update package.json                                                                                                                     
                                                                                                                                                       
 ```json                                                                                                                                               
   {                                                                                                                                                   
     "scripts": {                                                                                                                                      
       "db:init": "node database/init.js",                                                                                                             
       "db:migrate": "npx prisma migrate dev",                                                                                                         
       "db:deploy": "npx prisma migrate deploy",                                                                                                       
       "db:generate": "npx prisma generate",                                                                                                           
       "db:push": "npx prisma db push",                                                                                                                
       "db:studio": "npx prisma studio",                                                                                                               
       "db:reset": "npx prisma migrate reset"                                                                                                          
     }                                                                                                                                                 
   }                                                                                                                                                   
 ```                                                                                                                                                   
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Phase 8: Migration Checklist (Do in Order)                                                                                                            
                                                                                                                                                       
                                                                                                                                                
   Phase 1: Install & Setup                                                                                                                            
     □ npm install prisma --save-dev                                                                                                                   
     □ npm install @prisma/client                                                                                                                      
     □ npx prisma init                                                                                                                                 
     □ Configure prisma/schema.prisma with datasource                                                                                                  
                                                                                                                                                       
   Phase 2: Schema Definition                                                                                                                          
     □ Write the full schema (copy from Step 4)                                                                                                        
     □ npx prisma migrate dev --name init                                                                                                              
                                                                                                                                                       
   Phase 3: Repository Layer                                                                                                                           
     □ Create database/prismaService.js                                                                                                                
     □ Create database/repositories/SourceRepository.js                                                                                                
     □ Create database/repositories/CategoryRepository.js                                                                                              
     □ Create database/repositories/RegionRepository.js                                                                                                
     □ Create database/repositories/CouncilAreaRepository.js                                                                                           
     □ Create database/repositories/LocationRepository.js                                                                                              
     □ Create database/repositories/SeverityLevelRepository.js                                                                                         
     □ Create database/repositories/StatusTypeRepository.js                                                                                            
     □ Create database/repositories/UserRepository.js                                                                                                  
     □ Create database/repositories/SubscriptionRepository.js                                                                                          
     □ Create database/repositories/NotificationRepository.js                                                                                          
     □ Create database/repositories/AlertRepository.js                                                                                                 
     □ Create database/repositories/AlertMarkerRepository.js                                                                                           
     □ Create database/repositories/AlertPolygonRepository.js                                                                                          
     □ Create database/repositories/AlertPolylineRepository.js                                                                                         
     □ Create database/repositories/AlertRoadRepository.js                                                                                             
     □ Create database/repositories/AlertLinkRepository.js                                                                                             
     □ Create database/repositories/AlertAdviceRepository.js                                                                                           
     □ Create database/repositories/AlertFireDetailRepository.js                                                                                       
     □ Create database/repositories/AlertRegionRepository.js                                                                                           
     □ Create database/repositories/SourceHealthRepository.js                                                                                          
                                                                                                                                                       
   Phase 4: Controllers & Services                                                                                                                     
     □ Update controllers/alertsController.js                                                                                                          
     □ Update controllers/geoController.js                                                                                                             
     □ Update controllers/sourceHealthController.js                                                                                                    
     □ Update data-collection/ files                                                                                                                   
     □ Update services/ files                                                                                                                          
                                                                                                                                                       
   Phase 5: Cleanup                                                                                                                                    
     □ Remove database/dao/ directory                                                                                                                  
     □ Remove database/db.js (raw sqlite3 wrapper)                                                                                                     
     □ Update seed.js                                                                                                                                  
     □ Update init.js                                                                                                                                  
     □ Update package.json scripts                                                                                                                     
     □ Remove manual migrate.js or convert to a Prisma migration                                                                                       
                                                                                                                                                       
   Phase 6: Test                                                                                                                                       
     □ npm run db:migrate                                                                                                                              
     □ npm run db:init                                                                                                                                 
     □ npm test                                                                                                                                        
     □ npm run lint                                                                                                                                    
     □ Verify Prisma Studio: npm run db:studio                                                                                                                                                                                                                                                            
                                                                                                                                                       
 ────────────────────────────────────────────────────────────────────────────────                                                                      
                                                                                                                                                       
 Key Things to Watch Out For                                                                                                                           
                                                                                                                                                       
 ┌──────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ 
 │ Issue                                │ Solution                                                                                                   │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Boolean fields stored as INTEGER in  │ Prisma maps Boolean fine, but ensure your existing DB has 0/1 not "true"/"false" strings                   │ 
 │ SQLite                               │                                                                                                            │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ DATETIME fields stored as strings    │ Prisma expects ISO date strings for DateTime — your existing data should already be compatible             │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ SQLite AUTOINCREMENT                 │ Prisma handles @default(autoincrement()) automatically                                                     │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Foreign key enforcement              │ Your current PRAGMA foreign_keys = ON is the default in Prisma                                             │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Transactions                         │ Use prisma.$transaction([op1, op2]) or prisma.$transaction(async (tx) => { ... })                          │ 
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────┤ 
 │ Existing data migration              │ Run npx prisma db pull after Phase 2 to introspect your live DB, then npx prisma migrate resolve --applied │ 
 │                                      │ <migration-name> if needed                                                                                 │ 
 └──────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────┘