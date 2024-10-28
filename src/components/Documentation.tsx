import React from 'react';
import { Book, Terminal, Network, Database } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="prose prose-blue max-w-none">
      <h2 className="flex items-center gap-2">
        <Book className="h-6 w-6" />
        CIDR Calculator Documentation
      </h2>

      <div className="grid gap-8">
        <section>
          <h3 className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Basic Usage
          </h3>
          <p>
            Enter an IP address and CIDR prefix (e.g., 192.168.1.0/24) to calculate network details including:
          </p>
          <ul>
            <li>Network address and broadcast address</li>
            <li>First and last usable host addresses</li>
            <li>Total number of usable hosts</li>
            <li>Subnet mask and wildcard mask</li>
            <li>Binary representation</li>
          </ul>
        </section>

        <section>
          <h3 className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Subnet Planning
          </h3>
          <p>
            The subnet planner helps you divide a network into smaller subnets based on host requirements:
          </p>
          <ol>
            <li>Enter the base network in CIDR notation</li>
            <li>Specify required host counts for each subnet</li>
            <li>Get optimal subnet allocations automatically</li>
          </ol>
        </section>

        <section>
          <h3 className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Batch Processing
          </h3>
          <p>
            Process multiple CIDR ranges at once:
          </p>
          <ul>
            <li>Enter one CIDR per line</li>
            <li>Export results to CSV</li>
            <li>View all calculations in a table format</li>
          </ul>
        </section>
      </div>
    </div>
  );
}