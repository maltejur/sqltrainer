export interface Task {
  db: string;
  name: string;
  task: string;
  includeTables: string[];
  testQuery?: string;
  author?: string;
}
