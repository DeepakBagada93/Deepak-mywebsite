"""Payment processing service."""

from decimal import Decimal


class PaymentService:
    """Handles payment processing via external gateways."""

    async def process_payment(self, user_id: int, amount: Decimal) -> bool:
        """Process a payment for a user.

        Args:
            user_id: The user's ID
            amount: Payment amount in the user's currency

        Returns:
            True if payment was successful, False otherwise.
        """
        # Mock implementation — always succeeds
        # In production, this would call Stripe/Razorpay/PayPal
        return True

    async def refund_payment(self, order_id: int, amount: Decimal) -> bool:
        """Process a refund for an order.

        Args:
            order_id: The order ID to refund
            amount: Amount to refund

        Returns:
            True if refund was successful, False otherwise.
        """
        # Mock implementation
        return True


payment_service = PaymentService()


async def process_payment(user_id: int, amount: Decimal) -> bool:
    """Convenience function to process a payment."""
    return await payment_service.process_payment(user_id, amount)