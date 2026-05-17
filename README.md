# Public Safety Alerts Aggregator & Explorer

Software Development Project – Charles Sturt University  
Course: ITC303 / ITC306

## Project Overview

This project builds a system that collects public safety alerts from
open sources such as:

- NSW Rural Fire Service (RFS)
- NSW State Emergency Service (SES)
- Bureau of Meteorology (BoM)
- Road incident feeds

The system aggregates alerts, stores them in a MySQL database,
and provides a web interface to search, filter, and explore alerts
by region and category.

## Key Features

- Automated alert collection from RSS feeds and APIs
- Data normalisation and de-duplication
- MySQL alert database
- Backend API
- Web dashboard with search and filtering
- Map-based visualization

## Tech Stack

Backend: Express.js
Database: MySQL  
Frontend: Next.js 
Data Collection: RSS + APIs

## Team Members

- Ettore Vescio – Team Leader
- Christian Finocchiaro
- Thomas Smith
- Pradip Pandey

## How To Use
1. Clone the desired branch
2. In both the "client" and "backend" directories open a cmd terminal and type npm install
3. Go to the "backend" directory and create a ".env" file with  a "TFNSW_API_KEY"  containing your API key for Transport For New South Wales live traffic
4. Go to the "client" directory and create a ".env" file with a "GOOGLE_MAPS_API_KEY" variable containing your Google Maps Api key

The repo should now be ready to be modified. To run the project in developer mode:
1. Open a cmd terminal in the "backend" directory and type "npm run dev"
2. Open a cmd terminal in the "client" directory and type "npm run dev"

To build and run the final version of the project:
1. Open a cmd terminal in the "backend" directory and type "npm run build"
2. Open a cmd terminal in the "client" directory and type "npm run build"
3. Open a cmd terminal in the "backend" directory and type "npm run start"
4. Open a cmd terminal in the "client" directory and type "npm run start"
