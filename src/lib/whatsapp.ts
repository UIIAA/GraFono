export function getWhatsAppLink(phone: string, patientName: string, type: 'CONFIRMATION' | 'BILLING', extra?: any) {
    const cleanPhone = phone.replace(/\D/g, '');
    let message = "";

    if (type === 'CONFIRMATION') {
        message = `Olá, confirmamos a sessão de ${patientName} para amanhã?`;
    } else if (type === 'BILLING') {
        const month = extra?.month || "este mês";
        message = `Olá, notamos que o pagamento de ${month} referente a ${patientName} ainda não consta. Podemos ajudar?`;
    }

    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
}
