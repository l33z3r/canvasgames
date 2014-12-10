class HomeController < ApplicationController
  def index
    Pusher['test_channel'].trigger('my_event', {
      message: 'hello world'
    })
  end

  def push_data
    @channel_name = params[:channel_name]
    @event_name = params[:event_name]
    @json_data = params[:json_data]

    Pusher[@channel_name].trigger(@event_name , @json_data)

    render :json => "{ok: true}"
  end
end
