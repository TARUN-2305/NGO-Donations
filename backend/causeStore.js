import fs from "fs";
import path from "path";

// Persistence setup
const DATA_DIR = path.resolve("data");
const CAUSE_FILE = path.join(DATA_DIR, "causes.json");
const MILESTONE_FILE = path.join(DATA_DIR, "milestones.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let causes = {};
let milestones = {};

// Load persisted data
try {
    if (fs.existsSync(CAUSE_FILE)) causes = JSON.parse(fs.readFileSync(CAUSE_FILE));
    if (fs.existsSync(MILESTONE_FILE)) milestones = JSON.parse(fs.readFileSync(MILESTONE_FILE));
} catch (e) {
    console.error("Failed to load persistence files:", e);
}

function saveCauses() {
    fs.writeFileSync(CAUSE_FILE, JSON.stringify(causes, null, 2));
}

function saveMilestones() {
    fs.writeFileSync(MILESTONE_FILE, JSON.stringify(milestones, null, 2));
}

// Helpers
export { causes, milestones };

let causeCounter = Object.keys(causes).length > 0 ? Math.max(...Object.keys(causes).map(Number)) : 0;
let milestoneCounter = Object.keys(milestones).length > 0 ? Math.max(...Object.keys(milestones).map(Number)) : 0;

export function createCause({ title, budget }) {
    causeCounter++;
    const id = causeCounter;
    causes[id] = {
        id,
        title,
        budget: Number(budget), // INR
        raised: 0.0,
        status: "ACTIVE", // Start as Active for demo
        milestoneIds: []
    };
    saveCauses();
    return causes[id];
}

export function createMilestone({ causeId, description, allocation }) {
    if (!causes[causeId]) throw new Error("Cause not found");

    const cause = causes[causeId];
    const currentAllocated = cause.milestoneIds.reduce((sum, mid) => {
        return sum + (milestones[mid] ? milestones[mid].allocation : 0);
    }, 0);

    const remaining = cause.budget - currentAllocated;
    if (Number(allocation) > remaining) {
        throw new Error(`Allocation exceeds cause budget. You can allocate only ₹${remaining} more.`);
    }

    milestoneCounter++;
    const id = milestoneCounter;
    milestones[id] = {
        id,
        causeId: Number(causeId),
        description,
        allocation: Number(allocation), // INR
        status: "PENDING"
    };
    cause.milestoneIds.push(id);
    saveMilestones();
    saveCauses();
    return milestones[id];
}

export function recordCauseDonation(causeId, amount) {
    if (causes[causeId]) {
        const cause = causes[causeId];
        const newTotal = (cause.raised || 0) + Number(amount);

        if (newTotal > cause.budget) {
            throw new Error(`Donation exceeds cause funding goal. Remaining needed: ₹${cause.budget - (cause.raised || 0)}`);
        }

        cause.raised = newTotal;
        saveCauses();
    }
}

export function updateMilestoneStatus(id, status) {
    if (milestones[id]) {
        milestones[id].status = status;
        saveMilestones();
    }
}

export function getCauseDetails(causeId) {
    const cause = causes[causeId];
    if (!cause) return null;
    const causeMilestones = cause.milestoneIds.map(mid => milestones[mid]);
    return {
        ...cause,
        raised: cause.raised || 0,
        milestones: causeMilestones
    };
}
