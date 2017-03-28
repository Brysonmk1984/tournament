import { Component } from '@angular/core';

@Component({
	template : `
		<div class="page_wrapper">
			<div class="page_title_container">
				<h2>MTG Tournament Tracker Rules: </h2>
				<ul>
					<li><strong>Tournaments</strong></li>
					<ol>
						<li>Tournaments must contain at least 4 players</li>
						<li>Tournaments must contain at least 3 rounds</li>
						<li>Tournaments must be either draft or sealed format from new packages or prebuilt cubes</li>
						<li>Bryson or another admin must be notified within a week in order to update the official rankings</li>
					</ol>
					<li><strong>Ranking System</strong></li>
						<ol>
							<li> Games within matches count for nothing</li>
							<li>Champ status, or having "The Belt" means you won the last tournament</li>
							<li>Overall ranking is directly correlated with overall score
								<ul>
									<li>Overall score is the total of scores across all tournaments the player participated in</li>
								</ul>
							</li>
							<li>Power Ranking is the result of an algorithym, mainly judging performance in the last few tournaments</li>
								<ol>
									<li>If you've only played the last tournament and that was your only tournament:
										<ol>
											<li>That tournament is worth 100% of your power score (ranking)</li>
										</ol>
									</li>
									<li>If you've played in the last two tournaments:
										<ol>
											<li>The latest tournament is worth 70% of your power score (ranking)</li>
											<li>The second tournament is worth 30% of your power score (ranking)</li>
										</ol>
									</li>
									<li>If you've played more than 2 tournament, including both the most recent two tournaments:
										<ol>
											<li>The latest tournament is worth 70% of your power score (ranking)</li>
											<li>The second tournament is worth 20% of your power score (ranking)</li>
											<li>The average of all pervious tournaments are worth 10% of your power score (ranking)</li>
										</ol>
									</li>
								</ol>
							
							<li>Score = total point value
								<ul>
									<li>Wins (of whole matches): 2 points</li>
									<li>Losses (of whole matches): 0 points</li>
									<li>Draws (of whole matches): 1 point</li>
									<li>Byes (of whole matches): 2 points</li>
								</ul>
							</li>
							<li>Points (score) are only added by completed matches or draws</li>
						</ol>
					<li><strong>Integration With Challonge</strong></li>
						<ul>
							<li>All Tournament scores must come from Challonge, either through their API or through direct input</li>
								<ul>
									<li>If a player drops midway through the tournament, that player receives losses for the remaining tournament matches</li>
									<li>If a player drops midway through the tournament, that player's future oponents receive wins for the remaining tournament matches</li>
								</ul>
							<li>The only non-score tournament data is:
								<ul>
									<li>Ther date of the tournament</li>
									<li>The color data of each player, which is recorded by whoever records the tournament data</li>
								</ul>
							</li>
						</ul>
				</ul>
			</div>
		</div>

	`,
	selector : "rules-component"
})
export class RulesComponent{



	onInit(){

	}
}

