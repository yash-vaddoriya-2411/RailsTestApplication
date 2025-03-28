# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
company1 = Company.create(name: "TechCorp")
company2 = Company.create(name: "BizSolutions")
company3 = Company.create(name: "Salvador")
company4 = Company.create(name: "Juan")
company5 = Company.create(name: "InnovateX")
company6 = Company.create(name: "NextGen Solutions")
company7 = Company.create(name: "AlphaTech")
company8 = Company.create(name: "Visionary Systems")
company9 = Company.create(name: "Pioneer Labs")
company10 = Company.create(name: "Global Dynamics")
company11 = Company.create(name: "Stratosphere Inc.")
company12 = Company.create(name: "SynergySoft")
company13 = Company.create(name: "OmniTech")
company14 = Company.create(name: "Vertex Enterprises")
