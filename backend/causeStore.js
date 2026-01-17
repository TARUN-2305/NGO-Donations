export const causes = {};
export const milestones = {};

let causeCounter = 0;
let milestoneCounter = 0;

export function createCause({ title, budget }) {
    causeCounter++;
    const id = causeCounter;
    causes[id] = {
        id,
        title,
        budget: Number(budget),
        status: "PROPOSED", // PROPOSED -> ACTIVE -> COMPLETED
        milestoneIds: []
    };
    return causes[id];
}

export function createMilestone({ causeId, description, allocation }) {
    if (!causes[causeId]) throw new Error("Cause not found");

    milestoneCounter++;
    const id = milestoneCounter;
    milestones[id] = {
        id,
        causeId: Number(causeId),
        description,
        allocation: Number(allocation),
        status: "PENDING" // PENDING -> PAID
    };
    causes[causeId].milestoneIds.push(id);
    return milestones[id];
}

export function getCauseDetails(causeId) {
    const cause = causes[causeId];
    if (!cause) return null;
    const causeMilestones = cause.milestoneIds.map(mid => milestones[mid]);
    return { ...cause, milestones: causeMilestones };
}
