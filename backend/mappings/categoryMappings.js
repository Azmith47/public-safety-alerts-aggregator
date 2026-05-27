import { Categories } from "../models/enums.js";
/** 
* Internal canonical category mappings. 
* 
* Key: 
* - normalized external value 
* 
* Value: 
* - canonical internal category 
*/
const CATEGORY_MAPPINGS = {
    /** 
    * NSW RFS 
    */
    FIRE: Categories.FIRE,
    BUSH_FIRE: Categories.FIRE, 
    GRASS_FIRE: Categories.FIRE, 
    STRUCTURE_FIRE: Categories.FIRE, 
    HAYSTACK_FIRE: Categories.FIRE, 
    VEHICLE_EQUIPMENT_FIRE: Categories.FIRE,

    PLANNED_BURN: Categories.PLANNED_BURN,
    HAZARD_REDUCTION: Categories.PLANNED_BURN,
    BURN_OFF: Categories.PLANNED_BURN,
    
    STORM: Categories.STORM,
    FLOOD_STORM_TREE_DOWN: Categories.STORM,

    HAZMAT: Categories.HAZMAT,

    RESCUE: Categories.RESCUE,
    SEARCH_RESCUE: Categories.RESCUE,

    MEDICAL: Categories.MEDICAL,

    MVA_TRANSPORT: Categories.TRAFFIC_INCIDENT,

    FIRE_ALARM: Categories.OTHER,

    ASSIST_OTHER_AGENCY: Categories.OTHER,

    OTHER: Categories.OTHER,

    /** 
    * TFNSW 
    */
    TRAFFIC_INCIDENT: Categories.TRAFFIC_INCIDENT,
    ACCIDENT: Categories.TRAFFIC_INCIDENT,
    BREAKDOWN: Categories.TRAFFIC_INCIDENT,

    HAZARD: Categories.ROAD_HAZARD,
    ROAD_HAZARD: Categories.ROAD_HAZARD,
    ROADWORKS: Categories.ROAD_HAZARD,

    FLOOD: Categories.FLOOD,
    FLOODING: Categories.FLOOD,

    SPECIAL_EVENT: Categories.PUBLIC_EVENT,
    PUBLIC_EVENT: Categories.PUBLIC_EVENT,

    WEATHER: Categories.WEATHER,  
    
};

export default CATEGORY_MAPPINGS;