``` mermaid
graph TD
    %% Define Styles
    classDef feed fill:#f9f,stroke:#333,stroke-width:2px;
    classDef process fill:#bbf,stroke:#333,stroke-width:1px;
    classDef database fill:#f96,stroke:#333,stroke-width:2px;
    classDef api fill:#bfb,stroke:#333,stroke-width:2px;
    classDef ui fill:#fff,stroke:#333,stroke-width:1px;

    %% Subgraph for Pipeline Flow
    subgraph Data_Processing_Pipeline [Data Processing Pipeline]
        External_Feed[External Feed]:::feed
        Scheduled_Polling[Scheduled Polling]:::process
        Transformation_Layer[Transformation Layer]:::process
        Validation_Deduplication[Validation & Deduplication]:::process
    end

    subgraph Operational_Workflow [Operational Workflow]
        MySQL_Database[(MySQL Database)]:::database
        REST_API[REST API]:::api
        Frontend_Map_UI[Frontend Map/UI]:::ui
    end

    %% Flow Connections
    External_Feed --> Scheduled_Polling
    Scheduled_Polling --> Transformation_Layer
    Transformation_Layer --> Validation_Deduplication
    Validation_Deduplication --> MySQL_Database
    MySQL_Database --> REST_API
    REST_API --> Frontend_Map_UI

```