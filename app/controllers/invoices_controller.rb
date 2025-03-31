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
    result = InvoiceService.new(params).call

    if result[:success]
      flash.now[:notice] = result[:message]
      @invoice = result[:invoices] # Ensure @invoice is set properly

      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("invoice_form", partial: "invoices/success", locals: { invoices: @invoice }) }
        format.html { redirect_to success_invoice_path(@invoice) }
      end
    else
      flash.now[:alert] = result[:message]

      # Initialize @invoice and @check to prevent NoMethodError
      @invoice = Invoice.new
      @check = Check.new

      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("invoice_form", partial: "invoices/form") }
        format.html { redirect_to new_invoice_path }
      end
    end
  end




  def success
    @invoice = Invoice.find(params[:id])
    @check = @invoice.checks.first  # Use `.first` if multiple checks are linked
  end
end
