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
    invoice_numbers = params[:invoice][:number].split(",").map(&:strip)  # Extract multiple invoice numbers
    check_number = params[:check][:number]  # Extract check number

    if params[:check][:image].present? == false
      flash[:alert] = "Image is required."
      redirect_to new_check_path and return
    end

    # Check if Check number already exists
    if Check.exists?(number: check_number)
      flash[:alert] = "Check number #{check_number} already exists."
      redirect_to new_check_path and return
    end

    # Check if any invoice number already exists
    existing_invoice_numbers = Invoice.where(number: invoice_numbers).pluck(:number)

    if existing_invoice_numbers.any?
      flash[:alert] = "Invoice(s) already exist: #{existing_invoice_numbers.join(', ')}"
      redirect_to new_check_path and return
    end

    # Create Check
    @check = Check.create!(check_params)

    # Create Invoices and link them to Check
    invoice_numbers.each do |number|
      invoice = Invoice.create!(number: number, company_id: @check.company_id)
      CheckInvoice.create!(check_id: @check.id, invoice_id: invoice.id)
    end

    # Attach Image if present
    if params[:check][:image].present?
      decoded_image = decode_base64_image(params[:check][:image])
      @check.image.attach(io: StringIO.new(decoded_image), filename: "captured.jpg", content_type: "image/jpeg")
    end

    flash[:notice] = "Check and Invoices saved successfully!"
    redirect_to root_path
  rescue ActiveRecord::RecordInvalid => e
    flash[:alert] = "Error saving records: #{e.message}"
    render :new
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
