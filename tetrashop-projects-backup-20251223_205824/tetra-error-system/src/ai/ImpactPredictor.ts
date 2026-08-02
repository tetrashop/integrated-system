export async function predictFailureImpact(operationName: string, errorCode: string): Promise<number> {
    const highImpactErrors = ['DATABASE_CONNECTION_LOST', 'EXTERNAL_API_FAILURE', 'PAYMENT_GATEWAY_DOWN'];
    const mediumImpactErrors = ['VALIDATION_FAILED', 'TIMEOUT', 'RATE_LIMIT_EXCEEDED'];
    const criticalOperations = ['processPayment', 'createUser', 'generateInvoice'];
    
    let impactScore = 0.3;
    
    if (highImpactErrors.includes(errorCode)) impactScore = 0.9;
    else if (mediumImpactErrors.includes(errorCode)) impactScore = 0.6;
    
    if (criticalOperations.includes(operationName)) {
        impactScore = Math.min(impactScore + 0.15, 1.0);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    return impactScore;
}
