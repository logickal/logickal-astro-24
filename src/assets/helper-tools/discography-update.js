import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { parse as date } from 'date-fns';


let discog = [];

// This is for converting the master CSV (exported from XLS) to JSON