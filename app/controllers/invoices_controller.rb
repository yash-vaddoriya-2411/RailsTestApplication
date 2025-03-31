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
    result = CheckCreationService.new(params).call

    if result[:success]
      flash[:notice] = result[:message]
      redirect_to root_path
    else
      flash[:alert] = result[:message]
      redirect_to new_invoice_path
    end
  end
end
