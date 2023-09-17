import ticketModel from "../models/ticket.model.js";

class TicketManager {
    constructor() {
      this.ticketModel = ticketModel;
    }
    async createTicket(ticket) {
      try {
        const res = await this.ticketModel.create(ticket);
        return res;
      } catch (error) {
        console.log(error + "error en el create ticket");
      }
    }
  }
  

export default TicketManager;