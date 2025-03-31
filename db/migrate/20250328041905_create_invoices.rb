class CreateInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :invoices do |t|
      t.bigint :number, null: false
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end

    add_index :invoices, :number, unique: true
  end
end
