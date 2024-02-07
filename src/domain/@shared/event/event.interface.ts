// Interface responsible for transporting events in the domain

export default interface EventInterface {
    dataTimeOccurred: Date;
    eventData: any;
}