class CreateCheckInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :check_invoices, id: false do |t|
      t.references :check, null: false, foreign_key: true
      t.references :invoice, null: false, foreign_key: true

      t.timestamps
    end
  end
end
