class HealthCentre < ApplicationRecord
	has_many :procedures, foreign_key: :cnes_id, primary_key: :cnes
	has_many :health_centre_specialties
	has_many :specialties, through: :health_centre_specialties
	has_many :health_centre_types
	has_many :types, through: :health_centre_types
	validates :cnes, uniqueness: true
	validate :inSaoPaulo?

	def inSaoPaulo?
		pol = [[-46.65471793567885, -23.430652068732954], [-46.63137101328469, -23.42804445809224], [-46.61975292727287, -23.418310525127314], [-46.61470526039542, -23.41814468943273], [-46.61191470410149, -23.406729152557187], [-46.60106794856638, -23.389042845910886], [-46.593215903409586, -23.38539641625067], [-46.579176635850075, -23.37367031868577], [-46.568986254065486, -23.375491912085426], [-46.55542359855958, -23.364043684159142], [-46.5443742928497, -23.35773156982808], [-46.53621749249459, -23.363586945741343], [-46.54530133405413, -23.376191617538993], [-46.54465167405796, -23.384293631447754], [-46.557185079953406, -23.398254064936893], [-46.5578446320716, -23.409836644608546], [-46.56294645299548, -23.41279977224535], [-46.56727278013816, -23.430869853014148], [-46.56477427245175, -23.435939631280043], [-46.570720459372694, -23.457076313351134], [-46.56178561837507, -23.472632668712684], [-46.55912067849279, -23.507118366409575], [-46.54947525884975, -23.506813739366407], [-46.54107272865665, -23.493149184713147], [-46.51509461504805, -23.473769605393763], [-46.50702157754024, -23.47825496524512], [-46.493862600508876, -23.475976367025044], [-46.47976402134825, -23.476964744428262], [-46.45678629683616, -23.482745700050014], [-46.41894456087991, -23.47441943762165], [-46.41206480550457, -23.470411108578077], [-46.397734878458856, -23.485993144755476], [-46.38432079997003, -23.474139018514975], [-46.365108808562375, -23.503839376668783], [-46.366400508444784, -23.512170614984257], [-46.379582951450075, -23.516226691237424], [-46.39390390190411, -23.533791857456393], [-46.38785159480219, -23.546910263805497], [-46.39067157246545, -23.56011839591283], [-46.382478185422414, -23.563292284061255], [-46.383511568249844, -23.577882164289427], [-46.379944572745465, -23.5849609927387], [-46.38288575547726, -23.598923973360254], [-46.39968503261067, -23.606250115330827], [-46.39485383693939, -23.612445510130204], [-46.408150361625054, -23.627302084416762], [-46.4067204265281, -23.63197064474798], [-46.42114306499939, -23.643688707947202], [-46.432634836400545, -23.64176131014873], [-46.44670436166027, -23.644015414049026], [-46.463182789712704, -23.63880411688928], [-46.472299244699045, -23.638879855077814], [-46.47737639578151, -23.62594450868789], [-46.48155435573398, -23.62350566571479], [-46.50652098045438, -23.625889095859144], [-46.52255439282309, -23.61377150465365], [-46.53433031115326, -23.614454781357885], [-46.550612174941385, -23.606018062463043], [-46.55802291494583, -23.611827216871703], [-46.57878699401859, -23.600618892470983], [-46.58500585117254, -23.635063917348578], [-46.58460805183035, -23.645200016891202], [-46.61409141168431, -23.66021680597284], [-46.62649588570329, -23.661371107193144], [-46.62940974149334, -23.67699458375135], [-46.6350058156845, -23.689305353411086], [-46.624464417155664, -23.704815866904337], [-46.61631707321775, -23.708812541465104], [-46.64129565661235, -23.72618197405344], [-46.65390766876642, -23.72900852848149], [-46.6432048951577, -23.76060633173231], [-46.625652132980306, -23.780248756971456], [-46.62278702702336, -23.789773307582028], [-46.62362960253045, -23.81459702181819], [-46.634343749798624, -23.830393664408366], [-46.63236074440566, -23.852841092493286], [-46.61620400664916, -23.862732330431058], [-46.61748134910049, -23.884779864574966], [-46.61493699825568, -23.899704049007575], [-46.609185235175985, -23.904433433934436], [-46.61141101467627, -23.914059959890935], [-46.606134528764336, -23.956515238717703], [-46.611703737406685, -23.966836847670653], [-46.635664871501874, -23.97777877329334], [-46.63349840384643, -23.98816718903938], [-46.64141841968231, -23.998155373822943], [-46.65132662501722, -24.000855962627508], [-46.661397221533974, -23.98886842533409], [-46.680878372611396, -23.989636751355054], [-46.69415125037011, -23.98537872719248], [-46.710862508653356, -23.995445534846265], [-46.72239558883514, -23.992529961685698], [-46.73280825148167, -23.995813553667613], [-46.737551458921764, -23.99243457344396], [-46.75243566693038, -23.99634849860877], [-46.755291385431356, -24.002022916060756], [-46.76666687200127, -24.00437675793172], [-46.76776483265167, -23.99841595315084], [-46.756201991054894, -23.977289883726716], [-46.775341476435564, -23.95612655916542], [-46.78638149833826, -23.94156291041374], [-46.806404435494116, -23.93541357935472], [-46.81039891434095, -23.92163812037815], [-46.81115529323204, -23.906780730783783], [-46.800178613346354, -23.8935814810457], [-46.776915242361014, -23.89325518704499], [-46.775672238952865, -23.85634387704439], [-46.77340375168778, -23.843714102864045], [-46.76279448208547, -23.839891153644224], [-46.76264158746148, -23.827430254014775], [-46.78247983710156, -23.813253881803533], [-46.80093495732422, -23.810583993046365], [-46.800369888617, -23.801490432534003], [-46.78921354478081, -23.789763245220886], [-46.793571681889894, -23.777619253761348], [-46.78356729911837, -23.768151670854444], [-46.77448535344192, -23.767134714280207], [-46.77058927364866, -23.75413954747586], [-46.78779584224994, -23.747352214168792], [-46.795957261346125, -23.73878419508287], [-46.79856873667306, -23.731128711534886], [-46.79761080618856, -23.715837954674118], [-46.79165032724328, -23.704806045200794], [-46.8018904264185, -23.686144586561905], [-46.79541898546461, -23.66999209171236], [-46.792558812761186, -23.647135095304264], [-46.78494728633667, -23.63840223098747], [-46.777608642938105, -23.635262650629596], [-46.760465358128044, -23.61493710498632], [-46.75265947164582, -23.610591407464657], [-46.751433029533004, -23.601960856049743], [-46.762205083812674, -23.596845617683243], [-46.78925028513128, -23.606195884664015], [-46.79875713550936, -23.60491774335043], [-46.808752345194975, -23.609128378310757], [-46.80972395236642, -23.600112549978743], [-46.80704355232821, -23.584754128224656], [-46.79518545830861, -23.582469220490047], [-46.77935866590133, -23.571058964222562], [-46.772470747190425, -23.570229977780397], [-46.757907382520614, -23.550734174903607], [-46.76044322784435, -23.52974880315238], [-46.75714613066107, -23.516265610034935], [-46.76403237110915, -23.50645443791834], [-46.7555144951945, -23.496299882462406], [-46.76554986141779, -23.492935286596442], [-46.77113282227788, -23.482514166621268], [-46.77015846064633, -23.476672803292097], [-46.79256786908292, -23.460239225377737], [-46.80076541575151, -23.467208148596747], [-46.80539404433955, -23.462558315288934], [-46.80972634795751, -23.442350218817214], [-46.823263104063805, -23.423499624727416], [-46.81968131423626, -23.417922682195577], [-46.82617871120553, -23.409103441397253], [-46.81813729045948, -23.39942313058827], [-46.807632638749865, -23.399379717446255], [-46.80167804267741, -23.395425871407493], [-46.7871883536147, -23.404472295802844], [-46.784175128578, -23.399751574763215], [-46.77079946858913, -23.39710302359271], [-46.77043460983495, -23.38921271287064], [-46.76055082848239, -23.386037586015792], [-46.751735625826186, -23.39013555425206], [-46.73551006983132, -23.38814605647214], [-46.72266749642476, -23.395940383244128], [-46.71707087411188, -23.40686307517222], [-46.69813987114812, -23.424170845176608], [-46.67669696520174, -23.41510204923582], [-46.668702125817724, -23.418823022398108], [-46.65471793567885, -23.430652068732954]]
		pol_geokit = []
		pol.each do |latlng|
			pol_geokit.append(Geokit::LatLng.new(latlng[1], latlng[0]))
		end

		healthCentre = Geokit::LatLng.new(lat.to_s, long.to_s)
		sp = Geokit::Polygon.new(pol_geokit)

		errors.add(:lat, "O estabelecimento de Saúde deve estar na cidade de São Paulo") unless sp.contains? healthCentre
	end
end
