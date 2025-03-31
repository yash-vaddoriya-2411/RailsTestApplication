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
  
      # Get the first invoice from the returned list (since multiple invoices can be created)
      @invoice = result[:invoices].first
  
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("invoice_form", partial: "invoices/success", locals: { invoice: @invoice }) }
        format.html { redirect_to success_invoice_path(@invoice) } # Fallback for non-Turbo requests
      end
    else
      flash.now[:alert] = result[:message]
  
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("invoice_form", partial: "invoices/form") }
        format.html { redirect_to new_invoice_path } # Fallback
      end
    end
  end


  def success
    @invoice = Invoice.find(params[:id])
    @check = @invoice.checks.first  # Use `.first` if multiple checks are linked
  end
end
