import ticketModel from "../models/ticket.model.js";

class TicketManager {
    constructor(){
        this.model = ticketModel;
    }

    createTicket = async (ticket) => {
        const res = await this.model.create(ticket);
        return res;
    }
}

export default TicketManager;