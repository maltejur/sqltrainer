export interface Task {
  id: number;
  db: string;
  name: string;
  task: string;
  includeTables: string[];
  testQuery?: string;
  author?: string;
}
