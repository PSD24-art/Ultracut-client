export default function CheckoutInfo() {
  return (
    <div className="mt-10 text-sm text-gray-700 space-y-5 leading-relaxed">
      <h3 className="text-lg font-semibold text-gray-800">
        Before You Proceed
      </h3>

      <p>
        <strong>Shipping & Delivery:</strong> Orders are processed within{" "}
        <strong>24–48 working hours</strong> after confirmation. Delivery
        timelines depend on your location and the assigned logistics partner.
        Shipment tracking details are shared once the order is dispatched.
      </p>

      <p>
        <strong>Payments & Security:</strong> All payments are processed through{" "}
        <strong>secure and encrypted payment gateways</strong>. We support UPI,
        debit/credit cards, net banking, and Cash on Delivery (available in
        selected locations). Certain COD orders may require a confirmation
        amount.
      </p>

      <p>
        <strong>Returns & Replacement:</strong> Replacement requests are
        accepted only in case of{" "}
        <strong>manufacturing defects or transit damage</strong>. Any such issue
        must be reported within <strong>48 hours</strong> of delivery. Products
        that have been used, installed, or modified are not eligible for return
        or replacement.
      </p>

      <p>
        <strong>Tax & Invoicing:</strong> A valid <strong>GST invoice</strong>{" "}
        will be provided with every order. Please ensure that your billing and
        GST details are correct before placing the order, as invoices cannot be
        modified once generated.
      </p>

      <p>
        <strong>Support & Assistance:</strong> Post-sales technical support is
        available for all our products. For bulk orders, exports, or custom
        requirements, you may contact our team before completing the checkout.
      </p>

      <p className="pt-3 border-t text-gray-600">
        Need help before checkout? <br />
        📧 <strong>ultracut.innovation.acct@gmail.com</strong> <br />
        📞 <strong>+91 9979139392</strong>
      </p>
    </div>
  );
}
