var SCO_data = {
	config: {
		randomizeQuestions: true,
		randomizeLures: true
	},
	pages: [
		{
			title: "Title Page",
			type: 'title',
			behavior: {},
			text: "Degrees of freedom aware alive hover motion axis aluminum inverse kinematics. Register camera error feelings power. Three laws of robotics collision sensor feelings static Tik-Tok sensor jerk save lithium ion repair boop saw. Hybrid diode destroy programmable logic controller kawasaki chain mechanical boop wheel resistor performance Box reach. Automation ID-10T trigger point pneumatic wheel parallel motor metal acceleration titanium realtime no disassemble Bishop."
		},
		{
			title: "Content Page",
			type: 'content',
			behavior: {},
			text: "Linear iron cam programmable logic controller aware order simulation. Dexterity Gort Bender save autonomous repair servo singularity normalize Metal Man acceleration degrees of freedom hybrid Speedy. Error diode C-3PO motor sprocket serve and protect network Box order save recall aware collision sensor hydraulic lithium ion."
		},
		{
			title: "Question 1",
			type: 'question',
			qtype: 'choice',
			qid: '001',
			behavior: {
				lockNext: true
			},
			text: 'This is the question text. Select an answer (answer 1 is correct).',
			lures: [
				{
					id: 'A',
					text: 'Answer 1',
					correct: true
				},
				{
					id: 'B',
					text: 'Answer 2',
					correct: false
				},
				{
					id: 'C',
					text: 'Answer 3',
					correct: false
				},
				{
					id: 'D',
					text: 'Answer 4',
					correct: false
				}
			]
		},
		{
			title: "Question 2",
			type: 'question',
			qtype: 'choice',
			qid: '002',
			behavior: {
				lockNext: true
			},
			text: 'This is the question text. Select an answer (answer 1 is correct).',
			lures: [
				{
					id: 'A',
					text: 'Answer 1',
					correct: true
				},
				{
					id: 'B',
					text: 'Answer 2',
					correct: false
				},
				{
					id: 'C',
					text: 'Answer 3',
					correct: false
				},
				{
					id: 'D',
					text: 'Answer 4',
					correct: false
				}
			]
		},
		{
			title: "Question 3",
			type: 'question',
			qtype: 'choice',
			qid: '003',
			behavior: {
				lockNext: true
			},
			text: 'This is the question text. Select an answer (answer 1 is correct).',
			lures: [
				{
					id: 'A',
					text: 'Answer 1',
					correct: true
				},
				{
					id: 'B',
					text: 'Answer 2',
					correct: false
				},
				{
					id: 'C',
					text: 'Answer 3',
					correct: false
				},
				{
					id: 'D',
					text: 'Answer 4',
					correct: false
				}
			]
		},
		{
			title: 'Test Results',
			type: 'submit',
			behavior: {
				lockNext: true
			},
			text: 'Select <b>Submit</b> to grade the assessment. You will not be able to revisit your answers once you submit the assessment.'
		}
	]
};
