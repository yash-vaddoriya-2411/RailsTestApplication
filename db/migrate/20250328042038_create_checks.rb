class CreateChecks < ActiveRecord::Migration[8.0]
  def change
    create_table :checks do |t|
      t.bigint :number, null: false
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
    add_index :checks, :number, unique: true
  end
end
