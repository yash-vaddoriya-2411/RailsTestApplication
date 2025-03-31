# app/services/check_creation_service.rb
class CheckCreationService
  def initialize(params)
    @params = params
    @invoice_numbers = extract_invoice_numbers
    @check_number = extract_check_number
    @image_present = image_present?
  end

  def call
    return error_response("Image is required.") unless @image_present
    return error_response("Check number #{@check_number} already exists.") if check_exists?

    existing_invoices = existing_invoice_numbers
    return error_response("Invoice(s) already exist: #{existing_invoices.join(', ')}") if existing_invoices.any?

    ActiveRecord::Base.transaction do
      @check = create_check
      create_invoices
      attach_image if @image_present
    end

    success_response("Check and Invoices saved successfully!")
  rescue ActiveRecord::RecordInvalid => e
    error_response("Error saving records: #{e.message}")
  end

  private

  def extract_invoice_numbers
    @params[:invoice][:number].split(/\s*,\s*|\s+/).map(&:strip).reject(&:empty?)
  end


  def extract_check_number
    @params[:check][:number]
  end

  def image_present?
    @params[:check][:image].present?
  end

  def check_exists?
    Check.exists?(number: @check_number)
  end

  def existing_invoice_numbers
    Invoice.where(number: @invoice_numbers).pluck(:number)
  end

  def create_check
    Check.create!(@params.require(:check).permit(:number, :company_id))
  end

  def create_invoices
    @invoice_numbers.each do |number|
      invoice = Invoice.create!(number: number, company_id: @check.company_id)
      CheckInvoice.create!(check_id: @check.id, invoice_id: invoice.id)
    end
  end

  def attach_image
    decoded_image = decode_base64_image(@params[:check][:image])
    @check.image.attach(io: StringIO.new(decoded_image), filename: "captured.jpg", content_type: "image/jpeg")
  end

  def decode_base64_image(base64_string)
    return unless base64_string.present?

    base64_string = base64_string.split(",")[1] # Remove metadata
    Base64.decode64(base64_string) # Decode image
  end

  def error_response(message)
    { success: false, message: message }
  end

  def success_response(message)
    { success: true, message: message }
  end
end
