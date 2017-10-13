/* Template for making a campaign badge with Javascript */

(function(){
  if(!window.hq){ window.hq = {}; }

  // Encode string
  function e(str) { return encodeURIComponent(str); }

  // Escape HTML
  function h(unsafe) {
    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // Present?
  function present(str) {
    return str && str.length > 0;
  }

  // Pass campaign JSON data into this function to return a campaign badge as HTML
  function campaignBadge(campaign){

    // Video image
    function videoImage() {
      if(present(campaign.video_image)) {
        return '<img src="' + campaign.video_image + '" alt="' + h(campaign.name) + '">';
      } else {
        return '<div class="no_image"><i class="icon-image"></i></div>';
      }
    }

    // Campaign category
    function category() {
      if(present(campaign.category_name)) {
        return h(campaign.category_name);
      } else {
        return t('campaign_campaign_badge_category_not_set')
      }
    }

    // User name
    function userName() {
      if(present(campaign.user.name)) {
        return campaign.user.name;
      } else {
        return t('campaign_campaign_badge_anonymous');
      }
    }

    // Headline
    function headline() {
      if(present(campaign.headline)) {
        return campaign.headline;
      } else {
        return t('campaign_campaign_badge_headline_not_set')
      }
    }

    // Location
    function showLocation() {
      if(!campaign.show_location) { return ''; }

      function location() {
        if(!campaign.has_location) { return ''; }

        return ''
          + '<a href="/search?q=' + e(campaign.location) + '&amp;location=true">'
            + '<div class="icon icon-location"></div>' + e(campaign.location)
          + '</a>';
      }
      return '<div class="campaign_location">' + location() + '</div>';
    }

    // Progress
    function progress() {

      function percent() {
        return campaign.percent > -1 && campaign.percent < 100 ? campaign.percent.toFixed(2) : 100;
      }

      if(campaign.successful && campaign.can_expire) {
        return '<div class="campaign_successful">' + t('campaign_campaign_badge_successful') + '</div>';
      } else {
        return '<div class="progressbar"><div class="progress" style="width:' + percent() + '%"></div></div>';
      }
    }

    // Count
    function count() {
      return campaign.strategy === 'voting' ? campaign.votes_count : (site.currency_display + campaign.pledged);
    }

    // Status
    function status() {
      if(campaign.expired) {
        return campaign.funded ? t('campaign_campaign_badge_funded') : t('campaign_campaign_badge_finished');
      } else if(campaign.campaign_duration === 'unlimited') {
        return campaign.can_receive_contributions ? t('campaign_campaign_badge_open') : t('campaign_campaign_badge_closed');
      } else {
        return campaign.status;
      }
    }

    // Contributed
    function contributed() {
      return campaign.campaign_strategy === 'voting' ? t('campaign_campaign_badge_votes') : t('campaign_campaign_badge_contributed');
    }

    // Time left
    function timeLeft() {
      if(campaign.expired){
        return campaign.expires_at;
      } else if(campaign.campaign_duration === 'unlimited') {
        return campaign.can_receive_contributions ? campaign.approved_at : campaign.closed_at
      } else {
        return t('campaign_campaign_badge_to_go')
      }
    }

    // Goal text
    function goal() {
      return campaign.campaign_strategy === 'voting' ? t('campaign_campaign_badge_reached') : t('campaign_campaign_badge_funded')
    }

    return ''
      + '<div class="campaign_badge ' + (campaign.expired ? 'finished' : 'active') + '">'
        + '<div class="campaign_header">'
          + '<div class="campaign_image">'
            + '<a href="' + campaign.url + '">' + videoImage() + '</a>'
          + '</div>'
          + '<div class="campaign_category">' + category() + '</div>'
          + '<h1><a href="' + campaign.url + '">' + h(campaign.name) + '</a></h1>'
          + '<div class="campaign_owner" data-link="' + campaign.user.link + '">' + t('by') + ' ' + userName() + '</div>'
          + '<div class="campaign_headline">' + headline() + '</div>'
          + showLocation()
          + '<div class="clear"></div>'
        + '</div>'
        + '<div class="campaign_progress">'
          + progress()
          + '<div class="progress_info">'
            + '<table>'
              + '<tr class="numbers">'
                + (campaign.goal > 0 ? ('<td>' + parseInt(campaign.percent) + '%</td>') : '')
                + '<td>' + count() + '</td>'
                + '<td>' + status() + '</td>'
              + '</tr>'
              + '<tr class="desc">'
                + (campaign.goal > 0 ? ('<td>' + goal() + '</td>') : '')
                + '<td>' + contributed() + '</td>'
                + '<td>' + timeLeft() + '</td>'
              + '</tr>'
            + '</table>'
          + '</div>'
          + '<div class="clear"></div>'
        + '</div>'
      + '</div>';
  }
  window.hq.campaignBadge = campaignBadge;
}());
