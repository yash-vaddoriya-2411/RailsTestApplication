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
      flash[:notice] = result[:message]

      # Get the first invoice from the returned list (since multiple invoices can be created)
      @invoice = result[:invoices].first
      redirect_to success_invoice_path(@invoice)
    else
      flash[:alert] = result[:message]
      redirect_to new_invoice_path
    end
  end


  def success
    @invoice = Invoice.find(params[:id])
    @check = @invoice.checks.first  # Use `.first` if multiple checks are linked
  end
end
