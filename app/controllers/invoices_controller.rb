class InvoicesController < ApplicationController
  def index
    @invoices = Invoice.all
    @checkInvoices = CheckInvoice.all
  end

  def new
    @invoice = Invoice.new
    @check = Check.new
  end

  def create
    ActiveRecord::Base.transaction do
      @check = Check.create(check_params)  # Create Check first

      invoice_numbers = params[:invoice][:number].split(",").map(&:strip)  # Extract multiple invoice numbers

      invoice_numbers.each do |number|
        invoice = Invoice.create(number: number, company_id: @check.company_id)  # Create Invoice

        # Link the check with each invoice
        CheckInvoice.create(check_id: @check.id, invoice_id: invoice.id)
      end

      if params[:check][:image].present?
        decoded_image = decode_base64_image(params[:check][:image])
        @check.image.attach(io: StringIO.new(decoded_image), filename: "captured.jpg", content_type: "image/jpeg")
      end

      redirect_to root_path, notice: "Check and Invoices saved successfully!"
    end
  rescue ActiveRecord::RecordInvalid
    render :new, alert: "Error saving records"
  end

  private

  def check_params
    params.require(:check).permit(:number, :company_id)
  end

  def invoice_params
    params.require(:invoice).permit(:number)
  end

  def decode_base64_image(base64_string)
    base64_string = base64_string.split(",")[1] # Remove metadata
    Base64.decode64(base64_string) # Decode image
  end
end
