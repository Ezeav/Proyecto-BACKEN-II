import { TicketDAO } from "../dao/ticket.dao.js";
import { toTicketDTO } from "../dtos/ticket.dto.js";

const ticketDAO = new TicketDAO();

export const ticketRepository = {
  create: async (ticketData) => {
    const ticket = await ticketDAO.create(ticketData);
    return toTicketDTO(ticket);
  },
};

