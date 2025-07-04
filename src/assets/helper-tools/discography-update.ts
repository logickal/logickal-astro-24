import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { parse as date } from 'date-fns';

interface Album {
  [key: string]: any;
}

const discog: Album[] = [];
// Placeholder for converting the master CSV (exported from XLS) to JSON
