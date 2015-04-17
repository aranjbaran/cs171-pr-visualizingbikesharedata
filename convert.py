import csv
import json

data = csv.DictReader(open("hubway_trips.csv", "r"), delimiter = ",")
print data

output = []

counter = 0

for i,line in enumerate(data): 
	if line["strt_statn"] == "23":
		output.append(line)
		counter += 1
		# print line 
# print output
print counter
json_output = json.dumps(output, indent = 4)

with open('stationstatus_filtered.json', 'w') as f:
	f.write(json_output)


#break down different stations into different json files 