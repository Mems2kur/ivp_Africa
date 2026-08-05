import { AuditLogEntry } from "../types/auditLog";
const STORAGE_KEY= "IVP_audit_logs";

function readlogs(): AuditLogEntry[] {
    if(typeof window === "undefined") return [];
    try{
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]" )
    }catch{
        return [];
    }
}
function writelogs(logs: AuditLogEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}
export const auditLogsApi = {
    getAll(): AuditLogEntry[] {
        return readlogs().sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },
    add(adminName: string, action: string, target: string) {
        const logs = readlogs();
        logs.unshift({
            id: crypto.randomUUID(),
            adminName,
            action,
            target,
            createdAt: new Date().toISOString(),
        });
        writelogs(logs);
    }
}