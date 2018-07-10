module Jekyll
  module DataFormatter
    def other_fields_to_array(company)
      data_sources = []
      if company["from_approximately_how_many_sources_does_your_company_use_open_data_academic_institutions"]
        data_sources << "Academic Institutions"
      end
      if company["from_approximately_how_many_sources_does_your_company_use_open_data_charities_foundations"]
        data_sources << "Charities & Foundations"
      end
      if company["from_approximately_how_many_sources_does_your_company_use_open_data_municipal_government"]
        data_sources << "Municipal Government"
      end
      if company["from_approximately_how_many_sources_does_your_company_use_open_data_private_entities"]
        data_sources << "Private Entities"
      end
      if company["from_approximately_how_many_sources_does_your_company_use_open_data_social_sector"]
        data_sources << "Social Sector"
      end
      data_sources
    end

    def map_locations_to_en(location_name)
      location_map = {"Montrйal" => "Montreal", "Nouveau-Brunswick" => "New Brunswick", "Quйbec" => "Quebec", "Québec" => "Quebec"}
      if location_map.key?(location_name)
        location_name = location_map[location_name]
      else
      location_name
      end
    end

    def titlecase(str)
      no_caps = ["a", "an", "and", "as", "at", "but", "by", "for", "from", "if", "in", "nor", "of", "on", "or", "so", "the", "to", "via", "vs", "with ", "without", "yet"]
      cappedString = []
      unless str == nil
        str.downcase.split(" ").map! do | word |
          if no_caps.include?(word)
            cappedString << (word)
          else
            cappedString << word.capitalize
          end
        end
      end
      cappedString.join(" ")

    end

    def format_number_of_sources(page)
      value_map = {
        "10-Jan" => "1-10",
        "Nov-50" => "11-50",
      }

      source_answers = {
        "academic institutions" => page["from_approximately_how_many_sources_does_your_company_use_open_data_academic_institutions"],
        "charities & foundations" => page["from_approximately_how_many_sources_does_your_company_use_open_data_charities_foundations"],
        "federal government" => page["from_approximately_how_many_sources_does_your_company_use_open_data_federal_government"],
        "municipal government" => page["from_approximately_how_many_sources_does_your_company_use_open_data_municipal_government"],
        "private entities" => page["from_approximately_how_many_sources_does_your_company_use_open_data_private_entities"],
        "provincial government" => page["from_approximately_how_many_sources_does_your_company_use_open_data_provincial_government"],
        "social sector" => page["from_approximately_how_many_sources_does_your_company_use_open_data_social_sector"]
      }

      source_answers.map do | k, v |
        if value_map.keys.include?(v)
          source_answers[k] = value_map[v]
        end
      end

      source_answers.delete_if { |k,v| v == "0" || v == nil || v == "Undefined" }

      source_answers

    end

    def format_url(url)
      url_regex = /(^$)|(^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$)/ix
      if url.match(url_regex)
        url
      elsif
        url = "http://#{url}"
        if url.match(url_regex)
          url
        end
      else
        ""
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::DataFormatter)