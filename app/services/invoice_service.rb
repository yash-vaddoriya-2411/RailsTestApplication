class InvoiceService
  def initialize(params)
    @params = params
  end

  def call
    invoice_numbers = @params[:invoice][:number].split(/\s*,\s*|\s+/).map(&:strip).reject(&:empty?)
    check_number = @params[:check][:number]
    image_data = @params[:check][:image]

    return { success: false, message: "Image is required." } unless image_data.present?
    return { success: false, message: "Check number #{check_number} already exists." } if Check.exists?(number: check_number)

    existing_invoices = Invoice.where(number: invoice_numbers).pluck(:number)
    return { success: false, message: "Invoice(s) already exist: #{existing_invoices.join(', ')}" } if existing_invoices.any?

    ActiveRecord::Base.transaction do
      check = Check.create!(@params.require(:check).permit(:number, :company_id))
      invoices = []

      invoice_numbers.each do |number|
        invoice = Invoice.create!(number: number, company_id: check.company_id)
        CheckInvoice.create!(check_id: check.id, invoice_id: invoice.id)
        invoices << invoice  # Store created invoices
      end

      decoded_image = Base64.decode64(image_data.split(",")[1])
      check.image.attach(io: StringIO.new(decoded_image), filename: "captured.jpg", content_type: "image/jpeg")

      return { success: true, message: "Check and Invoices saved successfully!", invoices: invoices }
    end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, message: "Error saving records: #{e.message}" }
  end
end
