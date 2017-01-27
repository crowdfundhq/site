(function(){
  if(!window.hq) { window.hq = {}; }

  function campaignBadge (campaign) {

    var status = '';
    if(campaign.expired) {
      status += '<div class="status_image">';
      if(campaign.percent > 100.0) {
        status += '<img src="/images/successful_no_text.png"><p class="successful">' + t('campaign_campaign_badge_successful') + '</p>';
      } else if(campaign.campaign_strategy == 'keep'){
        status += '<img src="/images/not_successful_no_text.png"><p class="no_success">' + t('campaign_campaign_badge_goal_not_reached') + '</p>';
      } else if(campaign.campaign_strategy == 'all_or_nothing'){
        status += '<img src="/images/not_successful_no_text.png"><p class="no_success">' + t('campaign_campaign_badge_no_success') + '</p>';
      }
      status += '</div>';
    }

    var timeLeft = ['', ''];
    if(!campaign.never_ending) {
      timeLeft[0] = '<td>' + campaign.status + '</td>';
      timeLeft[1] = '<td>' + t('campaign_campaign_badge_to_go')+ '</td>';
    }

    return '<div class="campaign_badge">'
      + '<a href="' + campaign.url + '">'
        + status
        + '<div class="campaign_header">'
          + '<div class="campaign_image">'
            + '<img width="240" height="135" src="' + campaign.video_image + '">'
          + '</div>'
          + '<div class="campaign_category">'
            + (campaign.category_name || t('campaign_campaign_badge_category_not_set'))
          + '</div>'
          + '<h1>' + campaign.name + '</h1>'
          + '<div data-link="' + campaign.user.link + '" class="campaign_owner">'
            + t('by') + ' '
            + (campaign.user.name || t('campaign_campaign_badge_anonymous'))
          + '</div>'
          + '<div class="campaign_headline">'
            + (campaign.headline || t('campaign_campaign_badge_headline_not_set'))
          + '</div>'
          + '<div class="clear"></div>'
        + '</div>'
        + '<div class="campaign_progress">'
          + '<div class="progressbar">'
            + '<div style="width:' + (campaign.percent > 100 ? 100 : campaign.percent) + '%" class="progress"></div>'
          + '</div>'
          + '<div class="progress_info">'
            + '<table>'
              + '<tr class="numbers">'
                + '<td>' + campaign.percent + '%</td>'
                + '<td>' + site.currency_display + campaign.pledged + '</td>'
                + timeLeft[0]
              + '</tr>'
              + '<tr class="desc">'
                + '<td>' + t('campaign_campaign_badge_funded') + '</td>'
                + '<td>' + t('campaign_campaign_badge_contributed') + '</td>'
                + timeLeft[1]
              + '</tr>'
            + '</table>'
          + '</div>'
          + '<div class="clear"></div>'
        + '</div>'
      + '</a>'
    + '</div>'
  }
  window.hq.campaignBadge = campaignBadge;

}());
