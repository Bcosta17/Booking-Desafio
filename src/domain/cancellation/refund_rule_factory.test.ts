import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("Refund Rule Factory", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const currentDate = new Date()

        const startDate = new Date()
        startDate.setDate(currentDate.getDate() + 7)
        
        const checkInDate = startDate;
        const timeDiff = checkInDate.getTime() - currentDate.getTime();
        const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn)
    
    expect(refundRule).toBeInstanceOf(FullRefund)
    expect(refundRule.calculateRefund(1000)).toBe(0)
    })

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => { 
        const currentDate = new Date()
        
        const startDate = new Date()
        startDate.setDate(currentDate.getDate() + 5)
        
        const checkInDate = startDate;
        const timeDiff = checkInDate.getTime() - currentDate.getTime();
        const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn)
    
    expect(refundRule).toBeInstanceOf(PartialRefund)
    expect(refundRule.calculateRefund(1000)).toBe(500)
    })

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const currentDate = new Date()
        const checkInDate = currentDate;
        const timeDiff = checkInDate.getTime() - currentDate.getTime();
        const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn)
    
    expect(refundRule).toBeInstanceOf(NoRefund)
    expect(refundRule.calculateRefund(1000)).toBe(1000)
    })
    
});