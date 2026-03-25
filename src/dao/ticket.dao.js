import { TicketModel } from "../models/ticket.model.js";

export class TicketDAO {
  async create(ticketData) {
    return TicketModel.create(ticketData);
  }

  async findById(id) {
    return TicketModel.findById(id);
  }
}

